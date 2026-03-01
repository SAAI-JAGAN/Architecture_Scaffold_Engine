package config

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB(connection string) {
	var err error
	DB, err = sql.Open("postgres", connection)
	if err != nil {
		log.Fatal("DB connection failed:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("DB unreachable:", err)
	}
}