package token

import (
	"io/ioutil"

	"github.com/cfabrica46/chat-gin-web-socket/structure"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

func GenerateToken(username, idRoom string) (tokenString string, err error) {

	secret, err := ioutil.ReadFile("./keys/token.key")
	if err != nil {
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,
		"idRoom":   idRoom,
		"uuid":     uuid.NewString(),
	})

	tokenString, err = token.SignedString(secret)

	if err != nil {
		return
	}

	return
}

func ExtractTokenStructFromClaims(tokenString string) (tokenStruct structure.TokenStruct, err error) {
	token, err := jwt.Parse(tokenString, keyFunc())
	if err != nil {
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		tokenStruct.IDRoom = claims["idRoom"].(string)
		tokenStruct.Username = claims["username"].(string)
	}

	return
}

func keyFunc() func(token *jwt.Token) (interface{}, error) {

	return func(token *jwt.Token) (interface{}, error) {

		secret, err := ioutil.ReadFile("./keys/token.key")
		if err != nil {
			return nil, err
		}
		return secret, nil
	}
}
