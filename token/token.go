package token

import (
	"io/ioutil"
	"time"

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
