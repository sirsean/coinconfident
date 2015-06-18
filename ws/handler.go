package ws

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"strings"
	"github.com/gorilla/websocket"
	"github.com/sirsean/coinconfident/model"
	"github.com/sirsean/coinconfident/redis"
	"github.com/sirsean/coinconfident/service"
	"github.com/sirsean/coinconfident/web"
	"log"
	"net/http"
	"time"
	"crypto/rand"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
}

func generateKey() string {
	c := 128
	b := make([]byte, c)
	n, err := io.ReadFull(rand.Reader, b)
	if n != len(b) || err != nil {
		panic("Could not generate random number")
	}
	return strings.Replace(base64.URLEncoding.EncodeToString(b), "=", "", -1)
}

type handler struct {
	sockets    map[string]chan model.TransactionWrapper
	processors map[string]chan string // Transaction id
	Tickers    map[string]*time.Ticker
}

func NewHandler() handler {
	wsh := handler{}
	wsh.sockets = make(map[string]chan model.TransactionWrapper)
	wsh.processors = make(map[string]chan string)
	wsh.Tickers = make(map[string]*time.Ticker)
	return wsh
}

func (wsh handler) connect(ws *websocket.Conn, key string) *connection {
	wsh.sockets[key] = make(chan model.TransactionWrapper, 256)
	wsh.processors[key] = make(chan string, 256)
	wsh.Tickers[key] = time.NewTicker(time.Second * 60)
	return &connection{ws: ws, send: wsh.sockets[key]}
}

func (wsh handler) disconnect(key string) {
	log.Printf("disconnected %v", key)
	if _, ok := wsh.sockets[key]; ok {
		close(wsh.sockets[key])
		delete(wsh.sockets, key)
	}
	if _, ok := wsh.processors[key]; ok {
		close(wsh.processors[key])
		delete(wsh.processors, key)
	}
	if _, ok := wsh.Tickers[key]; ok {
		wsh.Tickers[key].Stop()
		delete(wsh.Tickers, key)
	}
}

func (wsh handler) process(key string, transactionId string) {
	if processor, ok := wsh.processors[key]; ok {
		processor <- transactionId
	}
}

func (wsh handler) send(key string, tw model.TransactionWrapper) {
	if socket, ok := wsh.sockets[key]; ok {
		socket <- tw
	}
}

func (wsh handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Printf("myheaders: %v", r.Header)
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("failed to upgrade websocket: %v", err)
		return
	}
	c := redis.Pool.Get()
	user, err := web.GetCurrentUser(r, c)
	c.Close()
	if err != nil {
		log.Printf("failed to get current user: %v", err)
		return
	}
	key := generateKey()
	log.Printf("connected %v, %v", user.Id, key)
	conn := wsh.connect(ws, key)
	defer wsh.disconnect(key)
	go wsh.tick(key, user.Id)
	go wsh.readFromRedis(key, user.Id)
	go wsh.readFromCoinbase(key, user.Id)
	go wsh.processTransactions(key)
	go conn.writer()
	conn.reader()
}

func (wsh handler) tick(key, userId string) {
	for t := range wsh.Tickers[key].C {
		log.Printf("user %v tick at %v", userId, t)
		wsh.readFromCoinbase(key, userId)
	}
}

func (wsh handler) readFromRedis(key, userId string) {
	c := redis.Pool.Get()
	defer c.Close()

	transactionIds, err := service.GetTransactionIdsForUser(c, userId)
	if err != nil {
		log.Printf("failed to get transactions from redis: %v", err)
		return
	}
	log.Printf("redis %v transactions", len(transactionIds))

	for _, id := range transactionIds {
		wsh.process(key, id)
	}
}

func (wsh handler) readFromCoinbase(key, userId string) {
	c := redis.Pool.Get()
	defer c.Close()

	user, _ := service.GetUser(c, userId)

	cb, err := service.OAuthClient(&user)
	if err != nil {
		log.Printf("failed to get client from coinbase for user %v: %v", user, err)
		return
	}
	foundTransaction := false
	currentPage, numPages := 1, 1
	for !foundTransaction && currentPage <= numPages {
		log.Printf("getting transactions, user %v page %v", user.Id, currentPage)
		response, err := cb.GetTransactions(currentPage)
		if err != nil {
			log.Printf("failed to read transactions from coinbase: %v", err)
			return
		}
		currentPage = int(response.CurrentPage) + 1
		numPages = int(response.NumPages)
		if err != nil {
			log.Printf("failed to get transactions: %v", err)
			return
		}
		log.Printf("num transactions: %v", len(response.Transactions))
		for _, t := range response.Transactions {
			createdAt, _ := time.Parse("2006-01-02T15:04:05-07:00", t.CreatedAt)
			transaction := model.Transaction{
				Id:        t.Id,
				CreatedAt: createdAt,
				Notes:     t.Notes,
				Idem:      t.Idem,
				Amount: model.Amount{
					Amount:   t.Amount.Amount,
					Currency: t.Amount.Currency,
				},
				Status: t.Status,
				Sender: model.Actor{
					Id:    t.Sender.Id,
					Name:  t.Sender.Name,
					Email: t.Sender.Email,
				},
				Recipient: model.Actor{
					Id:    t.Recipient.Id,
					Name:  t.Recipient.Name,
					Email: t.Recipient.Email,
				},
				RecipientAddress: t.RecipientAddress,
			}
			if service.DoesTransactionExist(c, transaction.Id) {
				foundTransaction = true
				service.SaveTransaction(c, transaction)
				wsh.process(key, transaction.Id)
			} else {
				service.AddTransaction(c, user.Id, transaction)
				wsh.process(key, transaction.Id)
			}
		}
	}
}

func (wsh handler) processTransactions(key string) {
	processor := wsh.processors[key]
	for id := range processor {
		log.Printf("processing transaction %v", id)
		c := redis.Pool.Get()
		tw, err := service.CalculateTransaction(c, id)
		c.Close()
		if err == nil {
			wsh.send(key, tw)
		}
	}
}

type connection struct {
	ws   *websocket.Conn
	send chan model.TransactionWrapper
}

func (c *connection) reader() {
	for {
		_, message, err := c.ws.ReadMessage()
		if err != nil {
			break
		}
		log.Printf("recv: %v", message)
	}
	c.ws.Close()
}

func (c *connection) writer() {
	for transaction := range c.send {
		log.Printf("sending transaction %v", transaction.Id)
		message, _ := json.Marshal(transaction)
		err := c.ws.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			break
		}
	}
	c.ws.Close()
}
