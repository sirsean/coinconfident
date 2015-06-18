package model

import (
	"encoding/json"
	"github.com/fabioberger/coinbase-go"
)

type User struct {
	Id     string
	Name   string
	Email  string
	Tokens coinbase.OauthTokens
}

func (u User) Serialize() []byte {
	r, _ := json.Marshal(u)
	return r
}

func DeserializeUser(r []byte) User {
	var u User
	json.Unmarshal(r, &u)
	return u
}
