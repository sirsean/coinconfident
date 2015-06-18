package model

import (
	"encoding/json"
	"strconv"
	"time"
)

type TransactionWrapper struct {
	Transaction
	CurrentConversion Amount
}

type Transaction struct {
	Id                 string
	CreatedAt          time.Time
	Notes              string
	Idem               string
	Amount             Amount
	Status             string
	Sender             Actor
	Recipient          Actor
	RecipientAddress   string
	OriginalConversion Amount
	MinConversion      Amount
	MinHistory         History
	MaxConversion      Amount
	MaxHistory         History
	LastCalculatedAt   time.Time
}

func (t Transaction) Serialize() []byte {
	r, _ := json.Marshal(t)
	return r
}

func DeserializeTransaction(r []byte) Transaction {
	var t Transaction
	json.Unmarshal(r, &t)
	return t
}

type Amount struct {
	Amount   string
	Currency string
}

func NewAmount(amount, currency string) Amount {
	return Amount{
		Amount:   amount,
		Currency: currency,
	}
}

func NewAmountFloatUsd(amount float64) Amount {
	return NewAmount(strconv.FormatFloat(amount, 'f', 2, 64), "USD")
}

func (a Amount) Parsed() float64 {
	f, _ := strconv.ParseFloat(a.Amount, 64)
	return f
}

type Actor struct {
	Id    string
	Name  string
	Email string
}
