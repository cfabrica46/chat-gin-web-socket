package database

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
)

var DB *sql.DB

const (
	PSQLHost     = "localhost"
	PSQLPort     = 5432
	PSQLUser     = "cfabrica46"
	PSQLPassword = "01234"
	PSQLDBName   = "chat_gin_web_socket"
)

var psqlInfo = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", PSQLHost, PSQLPort, PSQLUser, PSQLPassword, PSQLDBName)

func init() {
	var err error

	DB, err = open()
	if err != nil {
		log.Fatal(err)
	}
}

func open() (databases *sql.DB, err error) {
	databases, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		return
	}

	dataSQL, err := ioutil.ReadFile("database.sql")
	if err != nil {
		return
	}

	_, err = databases.Exec(string(dataSQL))
	if err != nil {
		return
	}
	return
}
