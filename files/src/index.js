import React from "react";
import ReactDOM from "react-dom";
import "./sass/style.scss";

class Message {
    constructor(owner, data, users, byServer, classMessage) {
        this.owner = owner;
        this.data = data;
        this.users = users;
        this.byServer = byServer;
        this.className = classMessage;
    }
}

function Background() {
    return (
        <span>
            <span className="bg"></span>
            <span className="bg bg2"></span>
            <span className="bg bg3"></span>
        </span>
    );
}

function DisplayNumberUsers(props) {
    return (
        <div className="chat-number-users">
            <p className="chat-number-users-text">
                Users Connected: {props.elements.length}
            </p>
        </div>
    );
}

function DisplayUsers(props) {
    return (
        <div className="chat-users">
            {props.elements.map((e) => (
                <h3>{e}</h3>
            ))}
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
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ws = new WebSocket(`${localStorage.getItem("host")}/api/v1/chat`);

    handleChange(event) {
        this.setState({ value: event.target.value });
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

        this.ws.onclose = (event) => {
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
            <form className="form form-message" onSubmit={this.handleSubmit}>
                <DisplayNumberUsers elements={this.state.users} />
                <DisplayMessages messages={this.state.msgs} />
                <div className="chat-input">
                    <input
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
        );
    }
}

class Chat extends React.Component {
    render() {
        return (
            <div>
                <Background />
                <main className="main">
                    <p className="title title--chat">Connected</p>
                    <FormChat handleMessage={this.handleMessage} />
                </main>
            </div>
        );
    }
}

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch("/api/v1/host", {
            method: "GET",
        })
            .then((responsive) => {
                if (responsive.status >= 400) {
                    throw true;
                }
                return responsive.json();
            })
            .then((resp) => {
                localStorage.setItem("host", resp);
            });
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        sessionStorage.setItem("owner", this.state.value);
        ReactDOM.render(<Chat />, document.getElementById("root"));
    }

    render() {
        return (
            <form className="form form-login" onSubmit={this.handleSubmit}>
                <label className="label" for="username">
                    Username
                </label>
                <input
                    name="username"
                    className="form--input-username"
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    required
                />
                <input
                    className="form--input-submit"
                    type="submit"
                    value="CONTINUE"
                />
            </form>
        );
    }
}

class Index extends React.Component {
    render() {
        return (
            <div>
                <Background />
                <main className="main">
                    <p className="title title--login">Welcome to Chat</p>
                    <Form />
                </main>
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById("root"));
