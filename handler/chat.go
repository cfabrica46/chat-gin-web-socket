package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/cfabrica46/chat-gin-web-socket/structure"
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
var conns = make(map[string]myConn)

func Chat(c *gin.Context) {
	var owner string

	var loginStruct structure.LoginStruct

	err := c.BindJSON(&loginStruct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}

	owner = loginStruct.Username

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	defer conn.Close()

	id := uuid.NewString()
	conns[id] = myConn{Conn: conn, Owner: owner}

	rooms[loginStruct.IDRoom] = conns

	go ping(conn)

	for {
		msg, err := receiveMessage(conn)
		if err != nil {
			delete(conns, id)

			users := getUsers(conns)
			m := message{Owner: owner, Data: "has gone out to the chat", Users: users, ByServer: true}

			data, err := json.Marshal(m)
			if err != nil {
				data = []byte("")
			}

			for i := range rooms[loginStruct.IDRoom] {
				go sendMessage(conns[i].Conn, data)
			}
			return
		}

		/*
		 *if msg.ByServer && msg.Data == "has joined the chat" {
		 *    conns[id] = myConn{Conn: conn, Owner: msg.Owner}
		 *    owner = msg.Owner
		 *}
		 */
		if msg.ByServer && msg.Data == "has gone out to the chat" {
			delete(conns, id)
			return
		}

		users := getUsers(conns)

		msg.Users = users

		data, err := json.Marshal(msg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"ErrMessage": "Internal Error",
			})
			return
		}

		for i := range rooms[loginStruct.IDRoom] {
			go sendMessage(conns[i].Conn, data)
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
