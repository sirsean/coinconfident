package history

import (
	"fmt"
	"github.com/sirsean/coinconfident/model"
	"github.com/sirsean/coinconfident/redis"
	"github.com/sirsean/coinconfident/service"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"
)

func Start() {
	ticker := time.Tick(10 * time.Minute)
	Load(true)
	for {
		select {
		case <-ticker:
			Load(true)
		}
	}
}

// GET https://api.coinbase.com/v1/prices/historical
// returns CSV format like:
// 2014-01-06T00:25:24-08:00,10.0
// 2014-01-06T00:25:24-08:00,10.0
// 2014-01-06T00:25:23-08:00,10.0
// 2014-01-06T00:25:23-08:00,10.0
// ...
// Then we parse that and stick it into Redis. We walk through pages until we get to
// a stopping point:
// 1) a timestamp we've seen before
// 2) an empty CSV
func Load(stopAtKnownTimestamp bool) {
	log.Printf("Loading historical prices")
	c := redis.Pool.Get()
	defer c.Close()
	page := 1
	for {
		response, err := http.Get(url(page))
		if err != nil {
			log.Printf("failed to get history: %v", err)
			return
		}
		defer response.Body.Close()
		bytes, err := ioutil.ReadAll(response.Body)
		if err != nil {
			log.Printf("failed to read history: %v", err)
			return
		}
		contents := string(bytes)
		//log.Printf(contents)
		lines := strings.Split(contents, "\n")
		log.Printf("history: %v lines on page %v", len(lines), page)
		if len(lines) == 0 {
			log.Printf("no more history to load")
			return
		}
		for _, line := range lines {
			pair := strings.Split(line, ",")
			if len(pair) < 2 {
				log.Printf("end of the lines? %v", pair)
				return
			}
			history := model.History{
				At:    pair[0],
				Price: pair[1],
			}
			if stopAtKnownTimestamp {
				if _, err = service.GetHistoryAt(c, history.AtTime()); err == nil {
					log.Printf("already got this history")
					return
				}
			}
			log.Printf("history: %v", history)
			service.SaveHistory(c, history)
		}
		page += 1
	}
}

func url(page int) string {
	return fmt.Sprintf("https://api.coinbase.com/v1/prices/historical?page=%v", page)
}
