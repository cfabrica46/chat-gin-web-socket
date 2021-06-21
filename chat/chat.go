package chat

import (
	"net/http"
	"strconv"

	"github.com/cfabrica46/chat-gin-web-socket/database"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Conex struct {
	User database.User
	C    *websocket.Conn
}

var rooms = make(map[int][]Conex)

var upgrader = websocket.Upgrader{}

func Chat(c *gin.Context) {

	idString := c.Param("id")

	idRoom, err := strconv.Atoi(idString)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	user := c.MustGet("user-data").(*database.User)
	if user == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	defer conn.Close()

	conex := Conex{
		User: *user,
		C:    conn,
	}

	if len(rooms[idRoom]) >= 2 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	rooms[idRoom] = append(rooms[idRoom], conex)

	SendMessageConect(conex, idRoom)

	for {
		_, message, err := conn.ReadMessage()

		if err != nil {
			Disconect(conex, idRoom)
			SendMessageDisconect(conex, idRoom)
			return
		}

		err = SendMessage(conex, idRoom, message)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"ErrMessage": "Internal Error",
			})
			return
		}

	}

}
