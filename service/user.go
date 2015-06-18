package service

import (
	"errors"
	"fmt"
	redigo "github.com/garyburd/redigo/redis"
	"github.com/sirsean/coinconfident/model"
)

func SaveUser(c redigo.Conn, u model.User) {
	c.Do("SET", fmt.Sprintf("user:%v", u.Id), u.Serialize())
}

func GetUser(c redigo.Conn, userId string) (user model.User, err error) {
	u, err := c.Do("GET", fmt.Sprintf("user:%v", userId))
	if err != nil {
		return
	}
	if u == nil {
		err = errors.New("no user found")
		return
	}
	user = model.DeserializeUser(u.([]byte))
	return
}
