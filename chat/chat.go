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
	Owner string `json:"owner"`
	Data  string `json:"data"`
}

var upgrader = websocket.Upgrader{}

var conns = make(map[string]*websocket.Conn)

func Chat(c *gin.Context) {

	/*
	 *var user struct {
	 *    Username string `json:"username"`
	 *}
	 */

	/*
	 *    err := c.BindJSON(&user)
	 *    if err != nil {
	 *        c.JSON(http.StatusBadRequest, gin.H{
	 *            "ErrMessage": "Bad Request",
	 *        })
	 *        return
	 *    }
	 *
	 *    welcomeMessage := message{Owner: user.Username, Data: fmt.Sprintf("%s has joined the Chat", user.Username)}
	 *
	 *    welcomeJSON, err := json.Marshal(welcomeMessage)
	 *    if err != nil {
	 *        c.JSON(http.StatusInternalServerError, gin.H{
	 *            "ErrMessage": "Internal Error",
	 *        })
	 *        return
	 *    }
	 *
	 *    welcomePersonalMessage := message{Owner: user.Username, Data: fmt.Sprintf("Joined the Chat")}
	 *
	 *    welcomePersonalJSON, err := json.Marshal(welcomePersonalMessage)
	 *    if err != nil {
	 *        c.JSON(http.StatusInternalServerError, gin.H{
	 *            "ErrMessage": "Internal Error",
	 *        })
	 *        return
	 *    }
	 */

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

	for {
		msg, err := ReceiveMessage(conn)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"ErrMessage": "Internal Error",
			})
			return
		}

		data, err := json.Marshal(msg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"ErrMessage": "Internal Error",
			})
			return
		}

		fmt.Printf("%s\n", msg)
		for i := range conns {
			go SendMessage(conns[i], data)
		}
	}

	/*
	 *    id := uuid.NewString()
	 *
	 *    conns[id] = conn
	 *
	 *    err = conn.WriteJSON(welcomePersonalJSON)
	 *    if err != nil {
	 *        delete(conns, id)
	 *        c.JSON(http.StatusInternalServerError, gin.H{
	 *            "ErrMessage": "Internal Error",
	 *        })
	 *        err = SendMessageDisconect(conn, id, user.Username)
	 *        if err != nil {
	 *            c.JSON(http.StatusInternalServerError, gin.H{
	 *                "ErrMessage": "Internal Error",
	 *            })
	 *            return
	 *        }
	 *        return
	 *    }
	 *
	 *    if len(conns) < 1 {
	 *        for i := range conns {
	 *            go func(i string) {
	 *                if conns[i] != conn {
	 *                    err = conns[i].WriteJSON(welcomeJSON)
	 *                    if err != nil {
	 *                        delete(conns, id)
	 *                        c.JSON(http.StatusInternalServerError, gin.H{
	 *                            "ErrMessage": "Internal Error",
	 *                        })
	 *                        err = SendMessageDisconect(conn, id, user.Username)
	 *                        if err != nil {
	 *                            c.JSON(http.StatusInternalServerError, gin.H{
	 *                                "ErrMessage": "Internal Error",
	 *                            })
	 *                            return
	 *                        }
	 *                        return
	 *                    }
	 *                }
	 *            }(i)
	 *        }
	 *    }
	 *
	 *    err = ReceiveAndSendMessage(conn, c, id)
	 *    if err != nil {
	 *        delete(conns, id)
	 *        c.JSON(http.StatusInternalServerError, gin.H{
	 *            "ErrMessage": "Internal Error",
	 *        })
	 *        err = SendMessageDisconect(conn, id, user.Username)
	 *        if err != nil {
	 *            c.JSON(http.StatusInternalServerError, gin.H{
	 *                "ErrMessage": "Internal Error",
	 *            })
	 *            return
	 *        }
	 *        return
	 *    }
	 */

}

func ReceiveMessage(conn *websocket.Conn) (newMessage message, err error) {
	err = conn.ReadJSON(&newMessage)
	if err != nil {
		return
	}
	return
}

func SendMessage(conn *websocket.Conn, data []byte) {
	err := conn.WriteMessage(1, data)
	if err != nil {
		return
	}
}

func ReceiveAndSendMessage(conn *websocket.Conn, id string) (err error) {
	var newMessage message

	for {
		var data []byte

		if conn.ReadJSON(&newMessage) != nil {
			return
		}

		data, err = json.Marshal(newMessage)
		if err != nil {
			return
		}

		for i := range conns {
			go func(i string) {
				err := conns[i].WriteJSON(data)
				if err != nil {
					return
				}
			}(i)
		}
	}
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
					}
				}
			}(i)
		}
	}
	return
}
