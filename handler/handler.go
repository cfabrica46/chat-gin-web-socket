package handler

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func GetHost(c *gin.Context) {
	var jsonURL struct {
		Fullhost string `json:"fullhost"`
	}

	host := os.Getenv("HOST")
	if host != "" {
		scheme := os.Getenv("SCHEME")
		if scheme == "" {
			scheme = "ws"
		}
		port := os.Getenv("PORT")
		fullhost := fmt.Sprintf("%s://%s:%s", scheme, host, port)
		jsonURL.Fullhost = fullhost
	} else {
		jsonURL.Fullhost = "wss://cfabrica46-chat.herokuapp.com"
	}

	c.JSON(http.StatusOK, jsonURL.Fullhost)
}
