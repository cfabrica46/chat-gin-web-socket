import React from "react";

class Message {
    constructor(token, message, usersConnected, isStatusMessage, classMessage) {
        this.token = token;
        this.message = message;
        this.usersConnected = usersConnected;
        this.isStatusMessage = isStatusMessage;
        this.classMessage = classMessage;
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
                <h3 className={`chat-msg ${message.classMessage}`}>
                    {message.byServer
                        ? `cesar ${message.message}`
                        : `cesar: ${message.message}`}
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
                `idRoom:${this.props.idRoom}`,
                [],
                true
            );
            this.ws.send(JSON.stringify(message));

            message = new Message(
                this.props.token,
                "has joined the chat",
                [],
                true
            );
            this.ws.send(JSON.stringify(message));
        };

        this.ws.onmessage = (m) => {
            let ping = false;
            let message = JSON.parse(m.data);

            if (message.isStatusMessage) {
                message.classMessage = "chat-msg--system";
                if (message.message === "ping") {
                    ping = true;
                }
            } else {
                if (message.token === this.props.token) {
                    message.classMessage = "chat-msg--user";
                } else {
                    message.classMessage = "chat-msg--other";
                }
            }

            if (!ping) {
                this.setState({ users: message.users });
                let msgs = this.state.msgs;
                message.users = null;
                msgs.push(message);
                this.setState({ msgs: msgs });
            }
        };

        this.ws.onclose = () => {
            let message = new Message(
                this.props.token,
                "has gone out to the chat",
                [],
                true
            );

            let msgs = this.state.msgs;
            message.users = null;
            msgs.push(message);
            this.setState({ msgs: msgs });
            this.setState({ value: "" });
            console.log("The connection has been closed successfully.");
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let message = new Message(
            this.props.token,
            this.state.value,
            [],
            false
        );
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
