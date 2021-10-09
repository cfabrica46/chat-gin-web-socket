import React from "react";

class Message {
    constructor(token, body) {
        this.token = token;
        this.body = body;
    }
}

function DisplayNumberUsers(props) {
    return (
        <div onClick={() => props.onClickShow()} className="chat-info">
            <h2 className="chat-idRoom">ROOM: {props.idRoom}</h2>
            <p className="chat-number-users">Users: {props.elements.length}</p>
        </div>
    );
}

function DisplayUsers(props) {
    return (
        <div className="chat-users">
            <i onClick={() => props.onClickOcult()} class="fas fa-times"></i>
            <p className="chat-users--title">Users Connected</p>
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

    scrollDown = () => {
        let msgsDiv = document.getElementById("chat-msgs");
        msgsDiv.scrollTop = msgsDiv.scrollHeight;
    };

    componentDidMount() {
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

        // this.ws.onclose = () => {
        //     let myMsg = {
        //         owner: this.props.owner,
        //         body: "has gone out to the chat",
        //         msgClass: "chat-msg--system",
        //         isStatusMessage: true,
        //     };

        //     let newMsgs = this.state.msgs;
        //     newMsgs.push(myMsg);
        //     this.setState({ msgs: newMsgs });
        //     this.setState({ value: "" });
        // };
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
                <DisplayNumberUsers
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
                    <label>
                        <input className="hidden" type="submit" />
                        <svg className="chat-input--submit">
                            <use xlinkHref="#check"></use>
                        </svg>
                    </label>
                </form>
                {this.state.showUsers && (
                    <DisplayUsers
                        onClickOcult={() => this.handleOcultUsers()}
                        elements={this.state.users}
                    />
                )}
            </div>
        );
    }
}

export { FormChat };
