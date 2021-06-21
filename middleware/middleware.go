package middleware

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/cfabrica46/chat-gin-web-socket/database"
	"github.com/cfabrica46/chat-gin-web-socket/token"
	"github.com/gin-gonic/gin"
)

func GetUserFromBody(c *gin.Context) {
	var user database.User

	err := json.NewDecoder(c.Request.Body).Decode(&user)
	if err != nil {
		if err != io.EOF {
			c.JSON(http.StatusInternalServerError, gin.H{
				"ErrMessage": "Internal Error",
			})
			return
		}
	}
	c.Set("user-data", &user)
	c.Next()
}

func GetUserFromToken(c *gin.Context) {

	var tokenValue database.Token

	if err := c.ShouldBindHeader(&tokenValue); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "Bad Request",
		})
		return
	}
	fmt.Println(1)
	check := database.CheckIfTokenIsIntoBlackList(tokenValue.Content)
	if check {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "El Token no es válido",
		})
		return
	}
	fmt.Println(2)

	userAux, err := token.ExtractUserFromClaims(tokenValue.Content)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "El Token no es válido",
		})
		return
	}
	fmt.Println(3)

	userAux.Token = tokenValue.Content

	deadline, err := time.Parse(time.ANSIC, userAux.Deadline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	fmt.Println(4)

	checkTime := time.Now().Local().After(deadline)

	if !checkTime {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "El Token no es válido",
		})
		return
	}
	fmt.Println(5)

	user, err := database.GetUserByID(userAux.ID)
	if err != nil {
		fmt.Println("holi", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": err.Error(),
		})
		return
	}
	user.Token, user.Deadline = userAux.Token, userAux.Deadline

	c.Set("user-data", user)
	c.Next()

}
