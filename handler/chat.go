package handler

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type myConn struct {
	Conn  *websocket.Conn
	Owner string
}

type message struct {
	Owner    string   `json:"owner"`
	Data     string   `json:"data"`
	Users    []string `json:"users"`
	ByServer bool     `json:"byServer"`
}

var upgrader = websocket.Upgrader{}

var rooms = make(map[string]map[string]myConn)

func Chat(c *gin.Context) {
	var owner, idRoom string
	var ocult bool

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	defer conn.Close()

	myID := uuid.NewString()

	go ping(conn)

	for {
		ocult = false
		msg, err := receiveMessage(conn)
		if err != nil {
			delete(rooms[idRoom], myID)

			users := getUsers(rooms[idRoom])
			m := message{Owner: owner, Data: "has gone out to the chat", Users: users, ByServer: true}

			data, err := json.Marshal(m)
			if err != nil {
				data = []byte("")
			}

			for i := range rooms[idRoom] {
				go sendMessage(rooms[idRoom][i].Conn, data)
			}
			return
		}

		if msg.ByServer && msg.Data == "has gone out to the chat" {
			delete(rooms[idRoom], myID)
			return
		}

		if msg.ByServer && strings.Contains(msg.Data, "idRoom:") {
			h := sha256.Sum256([]byte(msg.Data))
			idRoom = fmt.Sprintf("%x\n", h)

			owner = msg.Owner

			if len(rooms[idRoom]) == 0 {
				rooms[idRoom] = make(map[string]myConn)
				rooms[idRoom][myID] = myConn{Conn: conn, Owner: msg.Owner}
			} else {
				rooms[idRoom][myID] = myConn{Conn: conn, Owner: msg.Owner}
			}
			ocult = true
		}

		users := getUsers(rooms[idRoom])

		msg.Users = users

		data, err := json.Marshal(msg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"ErrMessage": "Internal Error",
			})
			return
		}

		if !ocult {
			for i := range rooms[idRoom] {
				go sendMessage(rooms[idRoom][i].Conn, data)
			}
		}

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

func getUsers(m map[string]myConn) (users []string) {
	for k := range m {
		users = append(users, m[k].Owner)
	}
	return
}

func ping(conn *websocket.Conn) {
	var msg = message{Data: "ping", ByServer: true}
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
