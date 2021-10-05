import React from "react";

class Message {
    constructor(token, body, isStatusMessage) {
        this.token = token;
        this.body = body;
        this.isStatusMessage = isStatusMessage;
    }
}

function DisplayNumberUsers(props) {
    return (
        <div onClick={() => props.onClickShow()} className="chat-number-users">
            <p className="chat-number-users-text">
                ID Room: {props.idRoom} | Users Connected:{" "}
                {props.elements.length}
            </p>
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
        <div className="chat-msgs">
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

    componentDidMount() {
        this.ws.onopen = () => {
            let message = new Message(
                this.props.token,
                "has joined the chat",
                true
            );
            this.ws.send(JSON.stringify(message));
        };

        this.ws.onmessage = (m) => {
            let ping = false;
            let messageClass;
            let message = JSON.parse(m.data);

            console.log(message);

            if (message.msg.body === "has joined the chat") {
                let newUsers = this.state.users;
                newUsers.push(message.owner);
                this.setState({ users: newUsers });
            }

            if (message.msg.isStatusMessage) {
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
                isStatusMessage: message.msg.isStatusMessage,
            };

            if (!ping) {
                let newMsgs = this.state.msgs;
                newMsgs.push(myMsg);
                this.setState({ msgs: newMsgs });
            }
        };

        this.ws.onclose = () => {
            let myMsg = {
                owner: this.props.owner,
                body: "has gone out to the chat",
                msgClass: "chat-msg--system",
                isStatusMessage: true,
            };

            console.log("wow");

            let newMsgs = this.state.msgs;
            newMsgs.push(myMsg);
            this.setState({ msgs: newMsgs });
            this.setState({ value: "" });
            console.log("The connection has been closed successfully.");
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let message = new Message(this.props.token, this.state.value, false);
        this.ws.send(JSON.stringify(message));
        this.setState({ value: "" });
    };

    render() {
        return (
            <div className="chat">
                <form
                    className="form form-message"
                    onSubmit={this.handleSubmit}
                >
                    <DisplayNumberUsers
                        onClickShow={() => this.handleShowUsers()}
                        onClickOcult={() => this.handleOcultUsers()}
                        elements={this.state.users}
                        showUsers={this.state.showUsers}
                        idRoom={this.props.idRoom}
                    />
                    <DisplayMessages messages={this.state.msgs} />
                    <div className="chat-input">
                        <input
                            autoFocus
                            className="chat-input--message"
                            type="text"
                            name="message"
                            value={this.state.value}
                            onChange={this.handleChange}
                            required
                        />
                        <input
                            className="chat-input--submit"
                            type="submit"
                            value="Submit"
                        />
                    </div>
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
