package chat

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

func Disconect(conex Conex, id int) {
	if len(rooms[id]) < 2 {
		rooms[id] = []Conex{}
		return
	}

	for i := range rooms[id] {
		if conex == rooms[id][i] {
			rooms[id] = append(rooms[id][:i], rooms[id][i+1:]...)
			return
		}
	}
}

func SendMessageConect(conex Conex, id int) {
	Message := struct {
		Message string
	}{}

	Message.Message = fmt.Sprintf("%s se ah conectado", conex.User.Username)
	dataJSON, _ := json.Marshal(Message)

	for i := range rooms[id] {
		if conex != rooms[id][i] {
			rooms[id][i].C.WriteMessage(websocket.TextMessage, dataJSON)
		}
	}
}

func SendMessageDisconect(conex Conex, id int) {
	Message := struct {
		Message string
	}{}

	Message.Message = fmt.Sprintf("%s se ha desconectado", conex.User.Username)

	dataJSON, _ := json.Marshal(Message)

	for i := range rooms[id] {
		if conex != rooms[id][i] {
			rooms[id][i].C.WriteMessage(websocket.TextMessage, dataJSON)
		}
	}
}

func SendMessage(conex Conex, id int, m []byte) (err error) {
	Message := struct {
		Message string
	}{}

	err = json.Unmarshal(m, &Message)
	if err != nil {
		return
	}

	Message.Message = fmt.Sprintf("%s: %s", conex.User.Username, Message.Message)

	dataJSON, _ := json.Marshal(Message)

	for i := range rooms[id] {
		if conex != rooms[id][i] {
			rooms[id][i].C.WriteMessage(websocket.TextMessage, dataJSON)
		}
	}
	return
}
