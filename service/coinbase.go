package service

import (
	"fmt"
	"github.com/fabioberger/coinbase-go"
	"github.com/sirsean/coinconfident/config"
	"github.com/sirsean/coinconfident/model"
	"github.com/sirsean/coinconfident/redis"
	"log"
	"time"
)

func OAuthService() (*coinbase.OAuth, error) {
	return coinbase.OAuthService(
		config.Get().Coinbase.ClientKey,
		config.Get().Coinbase.ClientSecret,
		fmt.Sprintf("http://%v/callback", config.Get().Host.Host),
	)
}

func OAuthClient(user *model.User) (client coinbase.Client, err error) {
	if isTokenExpired(&user.Tokens) {
		log.Printf("token expired at %v", user.Tokens.ExpireTime)
		var o *coinbase.OAuth
		o, err = OAuthService()
		if err != nil {
			return
		}
		oldTokens := map[string]interface{}{
			"refresh_token": user.Tokens.RefreshToken,
		}
		var tokens *coinbase.OauthTokens
		log.Printf("refreshing token")
		tokens, err = o.RefreshTokens(oldTokens)
		if err != nil {
			return
		}

		c := redis.Pool.Get()
		defer c.Close()

		user.Tokens = *tokens
		SaveUser(c, *user)
	}
	client = coinbase.OAuthClient(&user.Tokens)
	return
}

func isTokenExpired(tokens *coinbase.OauthTokens) bool {
	return time.Now().UTC().Unix() > tokens.ExpireTime
}
