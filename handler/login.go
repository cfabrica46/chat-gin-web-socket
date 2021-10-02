package handler

import (
	"log"
	"net/http"

	"github.com/cfabrica46/chat-gin-web-socket/structure"
	"github.com/cfabrica46/chat-gin-web-socket/token"
	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {

	var tokenStructure structure.TokenStruct

	err := c.BindJSON(&tokenStructure)
	if err == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	tokenString, err := token.GenerateToken(tokenStructure.Username, tokenStructure.IDRoom)
	if err != nil {
		log.Fatal(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
	})

}
