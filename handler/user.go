package handler

import (
	"net/http"

	"github.com/cfabrica46/chat-gin-web-socket/database"
	"github.com/gin-gonic/gin"
)

func Profile(c *gin.Context) {

	user := c.MustGet("user-data").(*database.User)
	if user == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	c.JSON(http.StatusOK, *user)
}
