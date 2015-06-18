package main

import (
	"fmt"
	"github.com/fabioberger/coinbase-go"
	"github.com/gorilla/mux"
	"github.com/sirsean/coinconfident/api"
	"github.com/sirsean/coinconfident/config"
	"github.com/sirsean/coinconfident/history"
	"github.com/sirsean/coinconfident/model"
	"github.com/sirsean/coinconfident/redis"
	"github.com/sirsean/coinconfident/service"
	"github.com/sirsean/coinconfident/web"
	"github.com/sirsean/coinconfident/ws"
	"html/template"
	"log"
	"net/http"
)

func main() {
	log.Printf("starting up")

	coinbase.BasePath = config.Get().Host.Path

	redis.Connect()

	go history.Start()

	router := mux.NewRouter()
	router.HandleFunc("/", index).Methods("GET")
	router.HandleFunc("/login", login).Methods("GET")
	router.HandleFunc("/logout", logout).Methods("GET")
	router.HandleFunc("/callback", callback).Methods("GET")

	router.HandleFunc("/api/history/average", api.HistoryMovingAverage).Methods("GET")
	router.HandleFunc("/api/history/latest", api.LatestHistory).Methods("GET")
	router.HandleFunc("/api/history/reload", api.ReloadHistory).Methods("POST")

	http.Handle("/ws", ws.NewHandler())

	router.PathPrefix("/").Handler(http.FileServer(http.Dir(fmt.Sprintf("%s/static/", config.Get().Host.Path))))
	http.Handle("/", router)

	port := config.Get().Host.Port
	log.Printf("Serving on port %v", port)
	log.Fatal(http.ListenAndServe(port, nil))
}

var indexTemplate = template.Must(template.ParseFiles(fmt.Sprintf("%s/template/index.html", config.Get().Host.Path)))

func index(w http.ResponseWriter, r *http.Request) {
	type Data struct {
		User struct {
			Id    string
			Name  string
			Email string
		}
	}
	data := Data{}

	c := redis.Pool.Get()
	defer c.Close()

	user, err := web.GetCurrentUser(r, c)
	if err == nil {
		data.User.Id = user.Id
		data.User.Name = user.Name
		data.User.Email = user.Email
	}
	log.Printf("Data: %v", data)

	indexTemplate.Execute(w, data)
}

func login(w http.ResponseWriter, r *http.Request) {
	o, err := service.OAuthService()
	if err != nil {
		log.Printf("failed to login: %v", err)
		return
	}
	scope := []string{"transactions", "user", "wallet:transactions:read", "wallet:user:read"}
	url := o.CreateAuthorizeUrl(scope)

	sessionId := web.NewSessionId()
	http.SetCookie(w, web.SessionStartCookie(sessionId))
	http.Redirect(w, r, url, 302)
}

func logout(w http.ResponseWriter, r *http.Request) {
	session, _ := web.GetCurrentSession(r)
	session.Options.MaxAge = -1
	session.Save(r, w)
	http.SetCookie(w, web.SessionEndCookie())
	http.Redirect(w, r, "/", 302)
}

func callback(w http.ResponseWriter, r *http.Request) {
	c := redis.Pool.Get()
	defer c.Close()

	o, err := service.OAuthService()
	query := r.URL.Query()
	code := query.Get("code")
	tokens, err := o.GetTokens(code, "authorization_code")
	if err != nil {
		log.Printf("failed to login: %v", err)
		return
	}
	log.Printf("tokens: %v", tokens)

	user := model.User{
		Tokens: *tokens,
	}
	cb, err := service.OAuthClient(&user)
	if err != nil {
		log.Printf("failed to login: %v", err)
		return
	}

	u, err := cb.GetUser()
	if err != nil {
		log.Printf("failed to login: %v", err)
		return
	}
	log.Printf("user: %v", u)

	user.Id = u.Id
	user.Name = u.Name
	user.Email = u.Email

	service.SaveUser(c, user)

	session, _ := web.GetCurrentSession(r)
	session.Values["userId"] = user.Id
	session.Save(r, w)
	http.Redirect(w, r, "/", 302)
}
