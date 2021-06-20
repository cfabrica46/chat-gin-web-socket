package main

import (
	"log"
	"net/http"
	"time"

	"github.com/cfabrica46/chat-gin-web-socket/database"
	"github.com/cfabrica46/chat-gin-web-socket/middleware"
	"github.com/cfabrica46/social-network-mongodb/server/handler"
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
		s.GET("/users", handler.ShowUsers)

		sGetUserFromBody := s.Group("/")
		sGetUserFromBody.Use(middleware.GetUserFromBody)
		{
			sGetUserFromBody.POST("/signin", handler.SignIn)
			sGetUserFromBody.POST("/signup", handler.SignUp)
		}
	}
	r.Run(":8080")
}
