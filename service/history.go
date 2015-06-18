package service

import (
	"errors"
	redigo "github.com/garyburd/redigo/redis"
	"github.com/sirsean/coinconfident/model"
	"time"
)

func SaveHistory(c redigo.Conn, h model.History) {
	c.Do("ZADD", "history", h.AtTime().Unix(), h.Serialize())
}

func GetHistoryAt(c redigo.Conn, at time.Time) (history model.History, err error) {
	rawRecords, err := c.Do("ZRANGEBYSCORE", "history", at.Unix(), at.Unix())
	if err != nil {
		return
	}
	records := rawRecords.([]interface{})
	if len(records) == 0 {
		err = errors.New("no history found")
		return
	}
	history = model.DeserializeHistory(records[0].([]byte))
	return
}

func GetHistorySince(c redigo.Conn, at time.Time) (all []model.History, err error) {
	rawRecords, err := c.Do("ZRANGEBYSCORE", "history", at.Unix(), "+inf")
	if err != nil {
		return
	}
	records := rawRecords.([]interface{})
	all = make([]model.History, len(records))
	for i, r := range records {
		all[i] = model.DeserializeHistory(r.([]byte))
	}
	return
}

func GetLastHistory(c redigo.Conn) (history model.History, err error) {
	rawRecords, err := c.Do("ZRANGE", "history", -1, -1)
	if err != nil {
		return
	}
	records := rawRecords.([]interface{})
	if len(records) == 0 {
		err = errors.New("no history found")
		return
	}
	history = model.DeserializeHistory(records[0].([]byte))
	return
}

func GetLastHistoryBefore(c redigo.Conn, at time.Time) (history model.History, err error) {
	rawRecords, err := c.Do("ZREVRANGEBYSCORE", "history", at.Unix(), "-inf", "LIMIT", 0, 1)
	if err != nil {
		return
	}
	records := rawRecords.([]interface{})
	if len(records) == 0 {
		err = errors.New("no history found")
		return
	}
	history = model.DeserializeHistory(records[0].([]byte))
	return
}
