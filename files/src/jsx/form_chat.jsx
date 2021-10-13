import React from "react";
import ReactDOM from "react-dom";
import { Index } from "./index";

class Message {
    constructor(token, body) {
        this.token = token;
        this.body = body;
    }
}

function DisplayInfo(props) {
    return (
        <div className="chat-info">
            <button
                onClick={() => props.onClickIndex()}
                class="fas fa-arrow-circle-left chat-exit"
            ></button>
            <h2 className="chat-idRoom">ROOM: {props.idRoom}</h2>
            <p
                onClick={() => props.onClickShow()}
                className="chat-number-users"
            >
                Users: {props.elements.length}
            </p>
        </div>
    );
}

function DisplayUsers(props) {
    return (
        <div ref={props.ref} className="chat-users">
            <i onClick={() => props.onClickOcult()} class="fas fa-times"></i>
            <p className="chat-users--title">Users Connected:</p>
            <ul className="chat-users--list">
                {props.elements.map((e) => (
                    <li className="chat-users--user"> {e}</li>
                ))}
            </ul>
        </div>
    );
}

function DisplayMessages(props) {
    return (
        <div className="chat-msgs" id="chat-msgs">
            {props.messages.map((message) => (
                <h3 className={`chat-msg ${message.msgClass}`}>
                    {message.isStatusMessage
                        ? `${message.owner} ${message.body}`
                        : `${message.owner}: ${message.body}`}
                </h3>
            ))}
        </div>
    );
}

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

class FormChat extends React.Component {
    state = {
        value: "",
        msgs: [],
        users: [],
        showUsers: false,
    };

    wrapperRef = React.createRef();

    ws = new WebSocket(`${localStorage.getItem("host")}/api/v1/chat`);

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    };

    handleShowUsers = () => {
        this.setState({ showUsers: true });
    };

    handleOcultUsers = () => {
        this.setState({ showUsers: false });
    };

    handleIndex = () => {
        this.ws.close();
        ReactDOM.render(<Index />, document.getElementById("root"));
    };

    scrollDown = () => {
        let msgsDiv = document.getElementById("chat-msgs");
        msgsDiv.scrollTop = msgsDiv.scrollHeight;
    };

    handleClickOutside = (event) => {
        if (
            this.wrapperRef.current &&
            !this.wrapperRef.current.contains(event.target)
        ) {
            this.handleOcultUsers();
        }
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);

        this.ws.onopen = () => {
            let message = new Message(this.props.token, "");
            this.ws.send(JSON.stringify(message));
        };

        this.ws.onmessage = (m) => {
            let ping = false;
            let messageClass;
            let message = JSON.parse(m.data);

            if (message.usersConnected) {
                this.setState({ users: message.usersConnected });
                return;
            }

            if (message.msg.body === "has joined the chat") {
                let newUsers = this.state.users;
                newUsers.push(message.owner);
                this.setState({ users: newUsers });
            }

            if (message.msg.body === "has gone out to the chat") {
                let newUsers = arrayRemove(this.state.users, message.owner);
                this.setState({ users: newUsers });
            }

            if (message.isStatusMessage) {
                messageClass = "chat-msg--system";
                if (message.msg.body === "ping") {
                    ping = true;
                }
            } else {
                if (message.owner === this.props.owner) {
                    messageClass = "chat-msg--user";
                } else {
                    messageClass = "chat-msg--other";
                }
            }

            let myMsg = {
                owner: message.owner,
                body: message.msg.body,
                msgClass: messageClass,
                isStatusMessage: message.isStatusMessage,
            };

            if (!ping) {
                let newMsgs = this.state.msgs;
                newMsgs.push(myMsg);
                this.setState({ msgs: newMsgs });
            }

            this.scrollDown();
        };
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let message = new Message(this.props.token, this.state.value);
        this.ws.send(JSON.stringify(message));
        this.setState({ value: "" });
    };

    render() {
        return (
            <div className="chat" id="chat">
                <DisplayInfo
                    onClickIndex={() => this.handleIndex()}
                    onClickShow={() => this.handleShowUsers()}
                    onClickOcult={() => this.handleOcultUsers()}
                    elements={this.state.users}
                    showUsers={this.state.showUsers}
                    idRoom={this.props.idRoom}
                />
                <DisplayMessages messages={this.state.msgs} />
                <form
                    className="form form-message"
                    onSubmit={this.handleSubmit}
                >
                    <input
                        autoFocus
                        className="chat-input--message"
                        type="text"
                        name="message"
                        value={this.state.value}
                        onChange={this.handleChange}
                        required
                    />
                    <label for="mySubmit" className="chat-submit-container">
                        <i class="fas fa-chevron-right chat-input--submit"></i>
                        <input id="mySubmit" type="submit" className="hidden" />
                    </label>
                </form>
                {this.state.showUsers && (
                    <div ref={this.wrapperRef}>
                        <DisplayUsers
                            onClickOcult={() => this.handleOcultUsers()}
                            elements={this.state.users}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export { FormChat };
