package token

import (
	"fmt"
	"io/ioutil"
	"time"

	"github.com/cfabrica46/chat-gin-web-socket/database"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

func GenerateToken(id int, username, role string) (tokenString string, err error) {
	secret, err := ioutil.ReadFile("key.pem")
	if err != nil {
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":        id,
		"username":  username,
		"dead-line": time.Now().Add(1 * time.Hour).Format(time.ANSIC),
		"role":      role,
		"uuid":      uuid.NewString(),
	})

	tokenString, err = token.SignedString(secret)
	if err != nil {
		return
	}
	return
}

func ExtractUserFromClaims(tokenString string) (user database.User, err error) {
	token, err := jwt.Parse(tokenString, KeyFunc)
	if err != nil {
		fmt.Println(err)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {

		if idFloat64, ok := claims["id"].(float64); ok {
			user.ID = int(idFloat64)
		} else {
			err = fmt.Errorf("error en obtener claims")
			return
		}

		if username, ok := claims["username"].(string); ok {
			user.Username = username
		} else {
			err = fmt.Errorf("error en obtener claims")
			return
		}

		if deadline, ok := claims["dead-line"].(string); ok {
			user.Deadline = deadline
		} else {
			err = fmt.Errorf("error en obtener claims")
			return
		}

		if role, ok := claims["role"].(string); ok {
			user.Role = role
		} else {
			err = fmt.Errorf("error en obtener claims")
			return
		}

	} else {
		err = fmt.Errorf("error en obtener claims")
	}
	return
}

func KeyFunc(token *jwt.Token) (interface{}, error) {

	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {

		return nil, fmt.Errorf("inesperado metodo : %v", token.Header["alg"])

	}

	secret, err := ioutil.ReadFile("key.pem")
	if err != nil {
		return nil, err
	}
	return secret, nil
}
