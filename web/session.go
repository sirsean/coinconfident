package web

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/gob"
	"errors"
	"fmt"
	redigo "github.com/garyburd/redigo/redis"
	"github.com/gorilla/sessions"
	"github.com/kurrik/oauth1a"
	"github.com/sirsean/coinconfident/model"
	"github.com/sirsean/coinconfident/service"
	"io"
	"log"
	"net/http"
	"strings"
)

var store = sessions.NewCookieStore([]byte("something-very-secret"))

func init() {
	fmt.Println("initializing web package")

	gob.Register(&oauth1a.UserConfig{})

	store.Options = &sessions.Options{
		MaxAge:   86400 * 365,
		HttpOnly: true,
		Path:     "/",
	}
}

func GetCurrentUser(r *http.Request, c redigo.Conn) (user model.User, err error) {
	session, err := GetCurrentSession(r)
	if err != nil {
		return
	}
	userId := session.Values["userId"].(string)
	user, err = service.GetUser(c, userId)
	return
}

func GetSessionByName(r *http.Request, name string) (session *sessions.Session, err error) {
	session, err = store.Get(r, name)
	return
}

func GetCurrentSession(r *http.Request) (session *sessions.Session, err error) {
	var sessionId string
	if sessionId, err = GetSessionId(r); err != nil {
		log.Printf("Got a callback with no session id: %v\n", err)
		//http.Error(rw, "No session found", 400)
		return
	}
	if session, err = store.Get(r, sessionId); err != nil {
		log.Printf("Error retrieving session: %v\n", err)
		//http.Error(rw, "No session found", 400)
		return
	}

	// you're not logged in unless you have a userId
	if session.Values["userId"] == nil {
		err = errors.New("Must have a userId to be logged in")
		return
	}

	return
}

func NewSessionId() string {
	c := 128
	b := make([]byte, c)
	n, err := io.ReadFull(rand.Reader, b)
	if n != len(b) || err != nil {
		panic("Could not generate random number")
	}
	return strings.Replace(base64.URLEncoding.EncodeToString(b), "=", "", -1)
}

func GetSessionId(req *http.Request) (id string, err error) {
	var c *http.Cookie
	if c, err = req.Cookie("session_id"); err != nil {
		return
	}
	id = c.Value
	return
}

func SessionStartCookie(id string) *http.Cookie {
	return sessions.NewCookie("session_id", id, store.Options)
}

func SessionEndCookie() *http.Cookie {
	return &http.Cookie{
		Name:     "session_id",
		Value:    "",
		MaxAge:   -1,
		Secure:   false,
		HttpOnly: true,
	}
}
