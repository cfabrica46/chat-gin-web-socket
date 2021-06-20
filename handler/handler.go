package handler

import (
	"net/http"

	"github.com/cfabrica46/gin-api-rest/server/token"
	"github.com/cfabrica46/social-network-mongodb/server/database"
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

	err := database.GetUser(user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "Usuario no encontrado",
		})
		return
	}

	user.Token, err = token.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
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
		c.JSON(http.StatusForbidden, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	if check {
		c.JSON(http.StatusForbidden, gin.H{
			"ErrMessage": "El nombre del usuario ya esta en uso",
		})
		return
	}

	err = database.AddUser(*user)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"ErrMessage": "El nombre del usuario ya esta en uso",
		})
		return
	}

	err = database.GetUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	user.Token, err = token.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	token := database.Token{Content: user.Token}

	c.JSON(http.StatusOK, token)

}
