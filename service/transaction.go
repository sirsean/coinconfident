package service

import (
	"fmt"
	redigo "github.com/garyburd/redigo/redis"
	"github.com/sirsean/coinconfident/model"
	"log"
	"time"
)

func AddTransaction(c redigo.Conn, userId string, t model.Transaction) {
	c.Do("RPUSH", fmt.Sprintf("user_transactions:%v", userId), t.Id)
	SaveTransaction(c, t)
}

func SaveTransaction(c redigo.Conn, t model.Transaction) {
	c.Do("SET", fmt.Sprintf("transactions:%v", t.Id), t.Serialize())
}

func GetTransaction(c redigo.Conn, id string) (t model.Transaction, err error) {
	raw, err := c.Do("GET", fmt.Sprintf("transactions:%v", id))
	if err != nil {
		return
	}
	t = model.DeserializeTransaction(raw.([]byte))
	return
}

func DoesTransactionExist(c redigo.Conn, transactionId string) bool {
	t, err := c.Do("GET", fmt.Sprintf("transactions:%v", transactionId))
	if err != nil {
		return false
	}
	return t != nil
}

func GetTransactionIdsForUser(c redigo.Conn, userId string) (transactionIds []string, err error) {
	rawRecords, err := c.Do("LRANGE", fmt.Sprintf("user_transactions:%v", userId), 0, -1)
	if err != nil {
		return
	}
	records := rawRecords.([]interface{})
	transactionIds = make([]string, len(records))
	for i, r := range records {
		transactionIds[i] = string(r.([]byte))
	}
	return
}

func CalculateTransaction(c redigo.Conn, id string) (tw model.TransactionWrapper, err error) {
	start := time.Now()
	t, err := GetTransaction(c, id)
	if err != nil {
		return
	}
	atTheTime, err := GetLastHistoryBefore(c, t.CreatedAt)
	if err != nil {
		return
	}
	if t.OriginalConversion.Amount == "" {
		log.Printf("getting original for %v", id)
		t.OriginalConversion = model.NewAmountFloatUsd(t.Amount.Parsed() * atTheTime.Parsed())
	}
	latest, err := GetLastHistory(c)
	var current model.Amount
	if err == nil {
		current = model.NewAmountFloatUsd(t.Amount.Parsed() * latest.Parsed())
	}

	if t.LastCalculatedAt.IsZero() {
		// get all history in one loop
		allHistory, err := GetHistorySince(c, t.CreatedAt.Add(-30*time.Minute))
		if err == nil {
			minBtc := atTheTime.Parsed()
			maxBtc := atTheTime.Parsed()
			for _, h := range allHistory {
				price := h.Parsed()
				if price <= minBtc {
					minBtc = price
					t.MinHistory = h
				}
				if price >= maxBtc {
					maxBtc = price
					t.MaxHistory = h
				}
			}
			t.MinConversion = model.NewAmountFloatUsd(t.Amount.Parsed() * minBtc)
			t.MaxConversion = model.NewAmountFloatUsd(t.Amount.Parsed() * maxBtc)
		}
	} else {
		// separate loops for min and max
		minBtc := t.MinHistory.Parsed()
		minHistory, err := GetHistorySince(c, t.LastCalculatedAt)
		if err == nil {
			for _, h := range minHistory {
				price := h.Parsed()
				if price < minBtc {
					minBtc = price
					t.MinHistory = h
				}
			}
		}
		t.MinConversion = model.NewAmountFloatUsd(t.Amount.Parsed() * minBtc)

		maxBtc := t.MaxHistory.Parsed()
		maxHistory, err := GetHistorySince(c, t.LastCalculatedAt)
		log.Printf("maxHistory: %v entries", len(maxHistory))
		if err == nil {
			for _, h := range maxHistory {
				price := h.Parsed()
				if price > maxBtc {
					maxBtc = price
					t.MaxHistory = h
				}
			}
		}
		t.MaxConversion = model.NewAmountFloatUsd(t.Amount.Parsed() * maxBtc)
	}

	t.LastCalculatedAt = time.Now()
	SaveTransaction(c, t)

	tw = model.TransactionWrapper{
		Transaction:       t,
		CurrentConversion: current,
	}
	log.Printf("Calculated %v in %v", id, time.Since(start))
	return
}
