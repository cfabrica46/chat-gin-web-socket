package database

import (
	"log"
)

func GetUserFromID(id string) (user *User, err error) {
	row := DB.QueryRow("SELECT users.username,users.password,users.role FROM users WHERE id = ?", id)

	err = row.Scan(user.Username, user.Password, user.Role)
	if err != nil {
		return
	}
	return
}

func GetUserFromUsername(username string) (user *User, err error) {
	row := DB.QueryRow("SELECT users.id,users.password,users.role FROM users WHERE id = ?", username)

	err = row.Scan(user.ID, user.Password, user.Role)
	if err != nil {
		return
	}
	return
}

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
