package handler

import (
	"fmt"
	"log"
	"net/http"

	"github.com/cfabrica46/chat-gin-web-socket/database"
	"github.com/cfabrica46/chat-gin-web-socket/token"
	"github.com/gin-gonic/gin"
)

func SignIn(c *gin.Context) {

	user := c.MustGet("user-data").(*database.User)
	if user == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	user, err := database.GetUserByUsernameAndPassword(user.Username, user.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "Usuario no encontrado",
		})
		return
	}
	if user == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "Usuario no encontrado",
		})
		return
	}
	fmt.Println(user)

	user.Token, err = token.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	token := database.Token{Content: user.Token}
	c.JSON(http.StatusOK, token)

}

func SignUp(c *gin.Context) {
	user := c.MustGet("user-data").(*database.User)
	if user == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	check, err := database.CheckIfUserAlreadyExist(user.Username)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	if check {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "El nombre del usuario ya esta en uso",
		})
		return
	}

	err = database.InsertUser(user.Username, user.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "El nombre del usuario ya esta en uso",
		})
		return
	}

	user, err = database.GetUserByUsername(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	fmt.Println(1)
	if user == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	fmt.Println(2)

	user.Token, err = token.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	fmt.Println("Se registro con exito")
	token := database.Token{Content: user.Token}

	c.JSON(http.StatusOK, token)

}
