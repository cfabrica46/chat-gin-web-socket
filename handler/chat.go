package handler

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/cfabrica46/chat-gin-web-socket/token"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type myConn struct {
	Conn  *websocket.Conn
	Owner string
	mu    *sync.Mutex
}

type message struct {
	Token           string   `json:"token"`
	Message         string   `json:"message"`
	UsersConnected  []string `json:"usersConnected"`
	IsStatusMessage bool     `json:"isStatusMessage"`
	Owner           string   `json:"owner"`
}

var upgrader = websocket.Upgrader{}

var rooms = make(map[string]map[string]myConn)

func Chat(c *gin.Context) {
	var idRoom, myID string
	var myToken, owner string
	var ocult bool

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	defer conn.Close()

	myID = uuid.NewString()

	mc := myConn{Conn: conn, mu: &sync.Mutex{}}

	go ping(&mc)

	for {
		ocult = false
		msg, err := receiveMessage(&mc)
		if err != nil {
			if idRoom == "" {
				return
			}

			delete(rooms[idRoom], myID)

			users := getUsersIntoRoom(rooms[idRoom])
			m := message{Token: myToken, Message: "has gone out to the chat", UsersConnected: users, IsStatusMessage: true, Owner: owner}

			msgJSON, err := json.Marshal(m)
			if err != nil {
				msgJSON = []byte{}
			}

			for i := range rooms[idRoom] {
				mc := rooms[idRoom][i]
				sendMessage(&mc, msgJSON)
			}
			return
		}

		if msg.Token == "" {
			return
		}

		if msg.IsStatusMessage && strings.Contains(msg.Message, "idRoom:") && idRoom == "" {
			idRoom, myToken, owner, err = asignChatVariables(&mc, msg, myID)
			if err != nil {
				return
			}
			ocult = true
		}

		if msg.IsStatusMessage && msg.Message == "has gone out to the chat" && myToken == msg.Token {
			delete(rooms[idRoom], myID)
			return
		}

		users := getUsersIntoRoom(rooms[idRoom])

		msg.UsersConnected = users
		msg.Owner = owner

		dataJSON, err := json.Marshal(msg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"ErrMessage": "Internal Error",
			})
			return
		}

		if !ocult {
			for i := range rooms[idRoom] {
				mc := rooms[idRoom][i]
				go sendMessage(&mc, dataJSON)
			}
		}

	}
}

func receiveMessage(mc *myConn) (newMessage message, err error) {
	err = mc.Conn.ReadJSON(&newMessage)
	if err != nil {
		return
	}
	return
}

func sendMessage(mc *myConn, data []byte) (err error) {
	mc.mu.Lock()
	defer mc.mu.Unlock()
	err = mc.Conn.WriteMessage(1, data)
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

func asignChatVariables(mc *myConn, msg message, myID string) (idRoom, myToken, owner string, err error) {
	hash := sha256.Sum256([]byte(msg.Message))
	idRoom = fmt.Sprintf("%x\n", hash)

	myToken = msg.Token

	tokenStructure, err := token.ExtractTokenStructFromClaims(myToken)
	if err != nil {
		return
	}

	owner = tokenStructure.Username
	mc.Owner = owner

	if len(rooms[idRoom]) == 0 {
		rooms[idRoom] = make(map[string]myConn)
		rooms[idRoom][myID] = *mc
	} else {
		rooms[idRoom][myID] = *mc
	}

	return
}

func ping(mc *myConn) {
	var msg = message{Message: "ping", IsStatusMessage: true}
	dataJSON, err := json.Marshal(msg)
	if err != nil {
		return
	}

	for {
		time.Sleep(time.Second * 30)
		mc.mu.Lock()
		err = sendMessage(mc, dataJSON)
		if err != nil {
			return
		}
		mc.mu.Unlock()
	}
}
