package main

import (
	"os"

	"github.com/cfabrica46/chat-gin-web-socket/chat"
	"github.com/cfabrica46/chat-gin-web-socket/handler"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load("./.env")

	r := gin.Default()
	r.Use(static.Serve("/", static.LocalFile("./files", false)))
	s := r.Group("/api/v1")
	{
		s.GET("/chat", chat.Chat)
		s.GET("/host", handler.GetHost)
	}
	r.Run(":" + os.Getenv("PORT"))
}
