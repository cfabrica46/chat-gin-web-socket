import React from "react";

class Message {
    constructor(owner, data, users, byServer, classMessage) {
        this.owner = owner;
        this.data = data;
        this.users = users;
        this.byServer = byServer;
        this.className = classMessage;
    }
}

function DisplayNumberUsers(props) {
    return (
        <div onClick={() => props.onClickShow()} className="chat-number-users">
            <p className="chat-number-users-text">
                Users Connected: {props.elements.length}
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
                        ? `${message.owner} ${message.data}`
                        : `${message.owner}: ${message.data}`}
                </h3>
            ))}
        </div>
    );
}

class FormChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            msgs: [],
            users: [],
            showUsers: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShowUsers = this.handleShowUsers.bind(this);
        this.handleOcultUsers = this.handleOcultUsers.bind(this);
    }

    ws = new WebSocket(`${localStorage.getItem("host")}/api/v1/chat`);

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleShowUsers() {
        this.setState({ showUsers: true });
    }

    handleOcultUsers() {
        this.setState({ showUsers: false });
    }

    componentDidMount() {
        this.ws.onopen = () => {
            let message = new Message(
                sessionStorage.getItem("owner"),
                "has joined the chat",
                null,
                true
            );
            this.ws.send(JSON.stringify(message));
            this.setState({ value: "" });
        };

        this.ws.onmessage = (m) => {
            let ping = false;
            let message = JSON.parse(m.data);

            if (message.byServer) {
                message.classMessage = "chat-msg--system";
                if (message.data === "ping") {
                    ping = true;
                }
            } else {
                if (message.owner === sessionStorage.getItem("owner")) {
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
                sessionStorage.getItem("owner"),
                "has gone out to the chat",
                null,
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

    handleSubmit(event) {
        event.preventDefault();

        let message = new Message(
            sessionStorage.getItem("owner"),
            this.state.value,
            null,
            false
        );
        this.ws.send(JSON.stringify(message));
        this.setState({ value: "" });
    }

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

