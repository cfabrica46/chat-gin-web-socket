package database

import (
	"log"
)

func CleanBlackList() {
	for {
		stmt, err := DB.Prepare("DELETE FROM black_list")
		if err != nil {
			log.Fatal(err)
		}

		_, err = stmt.Exec()
		if err != nil {
			log.Fatal(err)
		}
	}
}
