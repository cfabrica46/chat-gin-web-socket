package main

import (
	"log"
	"os"

	"github.com/cfabrica46/chat-gin-web-socket/handler"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("./.env")
	if err != nil {
		if os.Getenv("PORT") == "" {
			err = os.Setenv("PORT", "8080")
			if err != nil {
				log.Fatal(err)
			}
		}
	}

	r := gin.Default()
	r.Use(static.Serve("/", static.LocalFile("./files", false)))
	s := r.Group("/api/v1")
	{
		s.POST("/login", handler.Login)
		s.GET("/chat", handler.Chat)
		s.GET("/host", handler.GetHost)
	}
	// r.RunTLS(":"+os.Getenv("PORT"), "./keys/server.crt", "./keys/server.key")
	err = r.Run(":" + os.Getenv("PORT"))
	if err != nil {
		log.Println(err)
	}
}
