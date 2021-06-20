package database

import (
	"database/sql"
	"log"
)

func GetUserByID(id int) (user *User, err error) {
	row := DB.QueryRow("SELECT users.username,users.password,users.role FROM users WHERE users.id = ?", id)

	err = row.Scan(user.Username, user.Password, user.Role)
	if err != nil {
		return
	}
	return
}

func GetUserByUsername(username string) (user *User, err error) {
	row := DB.QueryRow("SELECT users.id,users.password,users.role FROM users WHERE users.username = ?", username)

	err = row.Scan(user.ID, user.Password, user.Role)
	if err != nil {
		return
	}
	return
}

func GetUserByUsernameAndPassword(username, password string) (user *User, err error) {
	row := DB.QueryRow("SELECT users.id,users.role FROM users WHERE users.username = ? AND users.password = ?", username, password)

	err = row.Scan(user.ID, user.Role)
	if err != nil {
		return
	}
	return
}

func CheckIfUserAlreadyExist(username string) (check bool, err error) {
	row := DB.QueryRow("SELECT users.id,users.password,users.role FROM users WHERE users.username = ?", username)

	var user User

	err = row.Scan(&user.ID, &user.Password, &user.Role)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
		}
		return
	}

	check = true
	return
}

func InsertUser(username, password string) (err error) {
	stmt, err := DB.Prepare("INSERT INTO users(username,password,role) VALUES ($1,$2,$3)")
	if err != nil {
		return
	}

	_, err = stmt.Exec(username, password, "member")
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
