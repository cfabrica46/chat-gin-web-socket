package handler

import (
	"encoding/json"
	"net/http"
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
	Token           string `json:"token"`
	Message         string `json:"message"`
	IsStatusMessage bool   `json:"isStatusMessage"`
}

const (
	messageConnect    = "has joined the chat"
	messageDisconnect = "has gone out to the chat"
)

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

			// users := getUsersIntoRoom(rooms[idRoom])
			m := message{Token: myToken, Message: messageDisconnect, IsStatusMessage: true}

			for i := range rooms[idRoom] {
				mc := rooms[idRoom][i]
				sendMessage(&mc, owner, m)
			}
		}

		if msg.Token == "" {
			return
		}

		if msg.IsStatusMessage && msg.Message == messageConnect {
			idRoom, myToken, owner, err = asignChatVariables(&mc, msg, myID)
			if err != nil {
				return
			}
			ocult = true
		}

		// users := getUsersIntoRoom(rooms[idRoom])

		// msg.UsersConnected = users
		// msg.Owner = owner

		if !ocult {
			for i := range rooms[idRoom] {
				mc := rooms[idRoom][i]
				go sendMessage(&mc, owner, msg)
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

func sendMessage(mc *myConn, owner string, msg message) (err error) {
	mc.mu.Lock()
	defer mc.mu.Unlock()

	var myMsg = struct {
		owner string
		msg   message
	}{
		owner,
		msg,
	}

	err = mc.Conn.WriteJSON(myMsg)
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
	myToken = msg.Token

	tokenStructure, err := token.ExtractTokenStructFromClaims(myToken)
	if err != nil {
		return
	}

	owner = tokenStructure.Username
	idRoom = tokenStructure.IDRoom
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
