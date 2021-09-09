package chat

import (
	"encoding/json"
	"log"
	"net/http"
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
var owner string

var conns = make(map[string]myConn)

func Chat(c *gin.Context) {

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ErrMessage": "Internal Error",
		})
		return
	}
	defer conn.Close()

	id := uuid.NewString()
	conns[id] = myConn{Conn: conn}

	go ping(conn)

	for {
		//send error disconect
		msg, err := receiveMessage(conn)
		if err != nil {
			log.Printf("%s has gone out to the chat", conns[id].Owner)
			delete(conns, id)
			users := getUsers(conns)
			var m = message{Owner: owner, Data: "has gone out to the chat", Users: users, ByServer: false}
			data, _ := json.Marshal(m)
			for i := range conns {
				go sendMessage(conns[i].Conn, data)
			}

			return
		}

		if msg.ByServer && msg.Data == "has joined the chat" {
			conns[id] = myConn{Conn: conn, Owner: msg.Owner}
			owner = msg.Owner
		}
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

		for i := range conns {
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

func ping(conn *websocket.Conn) (err error) {
	var msg = message{Data: "ping", ByServer: true}
	dataJSON, err := json.Marshal(msg)
	if err != nil {
		return
	}

	for {
		time.Sleep(time.Second * 30)
		err = sendMessage(conn, dataJSON)
		if err != nil {
			return
		}
	}
}
