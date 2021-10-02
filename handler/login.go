package main

import (
	"net/http"

	"github.com/cfabrica46/chat-gin-web-socket/structure"
	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {

	var loginStructure structure.LoginStruct

	err := c.BindJSON(&loginStructure)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

}
