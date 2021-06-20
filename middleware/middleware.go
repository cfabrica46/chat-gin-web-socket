package middleware

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/cfabrica46/chat-gin-web-socket/database"
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
