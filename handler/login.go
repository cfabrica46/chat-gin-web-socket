package handler

import (
	"net/http"

	"github.com/cfabrica46/chat-gin-web-socket/structure"
	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {

	var loginStruct structure.LoginStruct

	err := c.BindJSON(&loginStruct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	c.JSON(http.StatusAccepted, loginStruct)

}
