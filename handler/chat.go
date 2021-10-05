package handler

import (
	"log"
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
	Token string `json:"token"`
	Body  string `json:"body"`
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

	msg, err := receiveMessage(&mc)
	if err != nil {
		return
	}

	idRoom, myToken, owner, err = asignChatVariables(&mc, msg, myID)
	if err != nil {
		return
	}

	for i := range rooms[idRoom] {
		mc := rooms[idRoom][i]
		msg.Body = messageConnect
		go sendMessage(&mc, owner, true, msg)
	}

	go ping(&mc)

	for {
		msg, err := receiveMessage(&mc)
		if err != nil {
			delete(rooms[idRoom], myID)

			m := message{Token: myToken, Body: messageDisconnect}

			for i := range rooms[idRoom] {
				mc := rooms[idRoom][i]
				go sendMessage(&mc, owner, true, m)
			}
		}

		if msg.Token == "" {
			return
		}

		for i := range rooms[idRoom] {
			mc := rooms[idRoom][i]
			go sendMessage(&mc, owner, false, msg)
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

func sendMessage(mc *myConn, owner string, isStatusMessage bool, msg message) (err error) {
	mc.mu.Lock()
	defer mc.mu.Unlock()

	msg.Token = ""

	var myMsg = struct {
		Owner           string  `json:"owner"`
		isStatusMessage bool    `json:"isStatusMessage"`
		Msg             message `json:"msg"`
	}{
		owner,
		isStatusMessage,
		msg,
	}

	err = mc.Conn.WriteJSON(myMsg)
	if err != nil {
		log.Println(err)
		return
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
	var msg = message{Body: "ping"}

	for {
		time.Sleep(time.Second * 5)
		err := sendMessage(mc, "", true, msg)
		if err != nil {
			log.Println(err)
		}
	}
}
