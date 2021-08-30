package main

import (
	"os"

	"github.com/cfabrica46/chat-gin-web-socket/chat"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(static.Serve("/", static.LocalFile("./files", false)))

	s := r.Group("/api/v1")
	{
		s.GET("/chat", chat.Chat)
	}
	//r.Run(":8080")
	r.Run(":" + os.Getenv("PORT"))
}
