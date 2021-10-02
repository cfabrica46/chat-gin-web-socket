package handler

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/cfabrica46/chat-gin-web-socket/token"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type myConn struct {
	Conn  *websocket.Conn
	Owner string
}

type message struct {
	Token           string   `json:"token"`
	Message         string   `json:"message"`
	UsersConnected  []string `json:"usersConnected"`
	IsStatusMessage bool     `json:"isStatusMessage"`
}

var upgrader = websocket.Upgrader{}

var rooms = make(map[string]map[string]myConn)

func Chat(c *gin.Context) {
	var idRoom, myID string
	var myToken string
	// var ocult bool

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	defer conn.Close()

	myID = uuid.NewString()

	go ping(conn)

	for {
		// ocult = false
		msg, err := receiveMessage(conn)
		if err != nil {
			if idRoom == "" {
				return
			}

			delete(rooms[idRoom], myID)

			users := getUsersIntoRoom(rooms[idRoom])
			m := message{Token: myToken, Message: "has gone out to the chat", UsersConnected: users, IsStatusMessage: true}

			msgJSON, err := json.Marshal(m)
			if err != nil {
				msgJSON = []byte{}
			}

			for i := range rooms[idRoom] {
				go sendMessage(rooms[idRoom][i].Conn, msgJSON)
			}
			return
		}

		if msg.IsStatusMessage && strings.Contains(msg.Message, "idRoom:") && myToken == "" && idRoom == "" {
			idRoom, myToken, err = asignChatVariables(conn, msg, myID)
			if err != nil {
				return
			}
			// ocult = true
		}

		if msg.IsStatusMessage && msg.Message == "has gone out to the chat" {
			delete(rooms[idRoom], myID)
			return
		}

		// users := getUsers(rooms[idRoom])

		// msg.Users = users

		/* data, err := json.Marshal(msg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"ErrMessage": "Internal Error",
			})
			return
		} */

		// if !ocult {
		/* for i := range rooms[idRoom] {
			go sendMessage(rooms[idRoom][i].Conn, data)
		} */
		// }

	}
}

func receiveMessage(conn *websocket.Conn) (newMessage message, err error) {
	err = conn.ReadJSON(&newMessage)
	if err != nil {
		return
	}
	return
}

func sendMessage(conn *websocket.Conn, data []byte) (err error) {
	err = conn.WriteMessage(1, data)
	if err != nil {
		return
	}
	return
}

func getUsersIntoRoom(room map[string]myConn) (users []string) {
	for k := range room {
		users = append(users, room[k].Owner)
	}
	return
}

func asignChatVariables(conn *websocket.Conn, msg message, myID string) (idRoom, myToken string, err error) {
	hash := sha256.Sum256([]byte(msg.Message))
	idRoom = fmt.Sprintf("%x\n", hash)

	if rooms[idRoom] != nil {
		return
	}

	myToken = msg.Token

	tokenStructure, err := token.ExtractTokenStructFromClaims(myToken)
	if err != nil {
		return
	}

	if len(rooms[idRoom]) == 0 {
		rooms[idRoom] = make(map[string]myConn)
		rooms[idRoom][myID] = myConn{Conn: conn, Owner: tokenStructure.Username}
	} else {
		rooms[idRoom][myID] = myConn{Conn: conn, Owner: tokenStructure.Username}
	}

	return
}

func ping(conn *websocket.Conn) {
	var msg = message{Message: "ping", IsStatusMessage: true}
	dataJSON, err := json.Marshal(msg)
	if err != nil {
		return
	}

	for {
		time.Sleep(time.Second * 2)
		err = sendMessage(conn, dataJSON)
		if err != nil {
			return
		}
	}
}
