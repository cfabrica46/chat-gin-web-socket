package database

import (
	"database/sql"
	"log"
)

func CleanBlackList() {
	stmt, err := DB.Prepare("DELETE FROM black_list")
	if err != nil {
		log.Fatal(err)
	}

	_, err = stmt.Exec()
	if err != nil {
		log.Fatal(err)
	}
}

func CheckIfTokenIsIntoBlackList(token string) (check bool) {

	var tokenAux string

	row := DB.QueryRow("SELECT token FROM black_list WHERE token = $1", token)

	err := row.Scan(&tokenAux)
	if err != nil {
		if err == sql.ErrNoRows {
			return
		}
		check = true
	}

	return
}

func InsertTokenIntoBlackList(token string) (err error) {

	stmt, err := DB.Prepare("INSERT INTO black_list(token) VALUES ($1)")
	if err != nil {
		return
	}

	_, err = stmt.Exec(token)
	if err != nil {
		return
	}
	return

}
