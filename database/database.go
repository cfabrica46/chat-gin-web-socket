package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
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
	var userBeta User

	row := DB.QueryRow("SELECT users.id,users.password,users.role FROM users WHERE users.username = $1", username)
	err = row.Scan(&userBeta.ID, &userBeta.Password, &userBeta.Role)
	if err != nil {
		return
	}
	fmt.Println(userBeta)
	user = &userBeta
	return
}

func GetUserByUsernameAndPassword(username, password string) (user *User, err error) {
	row := DB.QueryRow("SELECT users.id,users.role FROM users WHERE users.username = $1 AND users.password = $2", username, password)

	var userBeta User

	err = row.Scan(&userBeta.ID, &userBeta.Role)
	if err != nil {
		return
	}
	user = &userBeta
	return
}

func CheckIfUserAlreadyExist(username string) (check bool, err error) {
	row := DB.QueryRow("SELECT users.id,users.password,users.role FROM users WHERE users.username = $1", username)

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
	stmt, err := DB.Prepare("DELETE FROM black_list")
	if err != nil {
		log.Fatal(err)
	}

	_, err = stmt.Exec()
	if err != nil {
		log.Fatal(err)
	}
}
