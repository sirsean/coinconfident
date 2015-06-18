package model

import (
	"encoding/json"
	"strconv"
	"time"
)

type History struct {
	At    string
	Price string
}

func HistoryTime(str string) time.Time {
	layout := "2006-01-02T15:04:05-07:00"
	t, _ := time.Parse(layout, str)
	return t
}

func (h History) AtTime() time.Time {
	return HistoryTime(h.At)
}

func (h History) Serialize() []byte {
	r, _ := json.Marshal(h)
	return r
}

func DeserializeHistory(r []byte) History {
	var h History
	json.Unmarshal(r, &h)
	return h
}

func (h History) Parsed() float64 {
	f, _ := strconv.ParseFloat(h.Price, 64)
	return f
}
