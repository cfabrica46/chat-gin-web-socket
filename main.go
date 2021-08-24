package main

import (
	"log"
	"net/http"
	"time"

	"github.com/cfabrica46/chat-gin-web-socket/chat"
	"github.com/cfabrica46/chat-gin-web-socket/database"
	"github.com/gin-gonic/gin"
)

func main() {
	log.SetFlags(log.Lshortfile)

	go func() {
		for {
			database.CleanBlackList()
			time.Sleep(time.Hour)
		}
	}()

	r := gin.Default()
	r.StaticFS("/index", http.Dir("files"))

	s := r.Group("/api/v1")
	{
		sGetUserFromToken.GET("/chat", chat.Chat)
	}
	r.Run(":8080")
}
