package chat

import (
	"encoding/json"
	"fmt"
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

	for {
		msg, err := receiveMessage(conn)
		if err != nil {
			//delete(conns, id)
			conn.Close()
			log.Printf("%s has gone out to the chat", conns[id].Owner)
			return
		}

		if msg.ByServer && msg.Data == "has joined the chat" {
			conns[id] = myConn{Conn: conn, Owner: msg.Owner}
		}
		if msg.ByServer && msg.Data == "has gone out to the chat" {
			delete(conns, id)
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
			fmt.Printf("%s\n", data)
			go sendMessage(conns[i].Conn, data)
		}
		/*
		 *} else {
		 *    conns[id] = myConn{Conn: conn, Owner: msg.Data}
		 *}
		 */

	}
}

func receiveMessage(conn *websocket.Conn) (newMessage message, err error) {
	conn.SetReadDeadline(time.Now().Add(time.Hour))
	err = conn.ReadJSON(&newMessage)
	if err != nil {
		return
	}
	return
}

func sendMessage(conn *websocket.Conn, data []byte) {
	err := conn.WriteMessage(1, data)
	if err != nil {
		return
	}
}

func getUsers(m map[string]myConn) (users []string) {
	for k := range m {
		users = append(users, m[k].Owner)
	}
	return
}
