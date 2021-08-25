package chat

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type message struct {
	Owner string
	Data  string
}

var upgrader = websocket.Upgrader{}

var conns = make(map[string]*websocket.Conn)

func Chat(c *gin.Context) {

	var user struct {
		Username string `json:"username"`
	}

	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"ErrMessage": "Bad Request",
		})
		return
	}

	welcomeMessage := message{Owner: user.Username, Data: fmt.Sprintf("%s has joined the Chat", user.Username)}

	welcomeJSON, err := json.Marshal(welcomeMessage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	welcomePersonalMessage := message{Owner: user.Username, Data: fmt.Sprintf("Joined the Chat")}

	welcomePersonalJSON, err := json.Marshal(welcomePersonalMessage)
	if err != nil {
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

	id := uuid.NewString()

	conns[id] = conn

	err = conn.WriteJSON(welcomePersonalJSON)
	if err != nil {
		delete(conns, id)
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		err = SendMessageDisconect(conn, id, user.Username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"ErrMessage": "Internal Error",
			})
			return
		}
		return
	}

	if len(conns) < 1 {
		for i := range conns {
			go func(i string) {
				if conns[i] != conn {
					err = conns[i].WriteJSON(welcomeJSON)
					if err != nil {
						delete(conns, id)
						c.JSON(http.StatusInternalServerError, gin.H{
							"ErrMessage": "Internal Error",
						})
						err = SendMessageDisconect(conn, id, user.Username)
						if err != nil {
							c.JSON(http.StatusInternalServerError, gin.H{
								"ErrMessage": "Internal Error",
							})
							return
						}
						return
					}
				}
			}(i)
		}
	}
}

func ReceiveMessage() {

}

func SendMessageDisconect(conn *websocket.Conn, id string, username string) (err error) {
	byeMessage := message{Owner: username, Data: fmt.Sprintf("%s has exited the Chat", username)}

	byeJSON, err := json.Marshal(byeMessage)
	if err != nil {
		return
	}

	if len(conns) < 1 {
		for i := range conns {
			go func(i string) {
				if conns[i] != conn {
					err = conns[i].WriteJSON(byeJSON)
					if err != nil {
						delete(conns, id)
						return
					}
				}
			}(i)
		}
	}
	return
}
