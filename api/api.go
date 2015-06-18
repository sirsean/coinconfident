package api

import (
	"encoding/json"
	"github.com/sirsean/coinconfident/history"
	"github.com/sirsean/coinconfident/redis"
	"github.com/sirsean/coinconfident/service"
	"github.com/sirsean/coinconfident/model"
	"net/http"
	"time"
	"log"
)

func HistoryMovingAverage(w http.ResponseWriter, r *http.Request) {
	c := redis.Pool.Get()
	defer c.Close()

	oneMonthAgo := time.Now().Add(time.Hour * 24 * 30 * -1)

	histories, _ := service.GetHistorySince(c, oneMonthAgo)
	log.Printf("there are %v histories", len(histories))

	prices := make([]float64, len(histories))
	for i, h := range histories {
		prices[i] = h.Parsed()
	}
	average := service.MovingAverageFloat(len(histories) / 2, prices)

	latest, _ := service.GetLastHistory(c)

	type Response struct {
		Average float64
		Latest model.History
	}
	response, _ := json.Marshal(Response{
		Average: average,
		Latest: latest,
	})
	w.Write(response)
}

func LatestHistory(w http.ResponseWriter, r *http.Request) {
	c := redis.Pool.Get()
	defer c.Close()

	h, err := service.GetLastHistory(c)
	if err != nil {
		return
	}

	response, _ := json.Marshal(h)
	w.Write(response)
}

func ReloadHistory(w http.ResponseWriter, r *http.Request) {
	history.Load(false)
}
