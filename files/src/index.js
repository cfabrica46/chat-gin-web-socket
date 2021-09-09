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

function DisplayElementsSlice(props) {
    return (
        <div>
            {props.elements.map((e) => (
                <h3>{e}</h3>
            ))}
        </div>
    );
}

function DisplayMessages(props) {
    return (
        <div>
            {props.messages.map((message) => (
                <h3 className={message.classMessage}>
                    {message.byServer
                        ? `${message.owner} ${message.data}`
                        : `${message.owner}: ${message.data}`}
                </h3>
            ))}
        </div>
    );
}

/*
 *function Ping(ws) {
 *    if (!ws) return;
 *    if (ws.readyState !== 1) return;
 *
 *    let message = new Message(
 *        sessionStorage.getItem("owner"),
 *        "ping",
 *        null,
 *        true
 *    );
 *
 *    console.log(message.data);
 *    ws.send(JSON.stringify(message));
 *}
 */

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
                message.classMessage = "message--system";
                if (message.data === "ping") {
                    ping = true;
                }
            } else {
                if (message.owner === sessionStorage.getItem("owner")) {
                    message.classMessage = "message--user";
                } else {
                    message.classMessage = "message--other";
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
            <form onSubmit={this.handleSubmit}>
                <DisplayMessages messages={this.state.msgs} />
                <label>
                    Message:
                    <input
                        type="text"
                        value={this.state.value}
                        onChange={this.handleChange}
                        required
                    />
                </label>
                <input type="submit" value="Submit" />
                <DisplayElementsSlice elements={this.state.users} />
            </form>
        );
    }
}

class Chat extends React.Component {
    render() {
        return (
            <div>
                <Background />
                <span className="title">Connected</span>
                <FormChat handleMessage={this.handleMessage} />
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
            <form className="login--form" onSubmit={this.handleSubmit}>
                <label className="label" for="username">
                    Username
                </label>
                <input
                    name="username"
                    className="login--input-username"
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    required
                />
                <input
                    className="login--input-submit"
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
                    <p className="title">Welcome to Chat</p>
                    <Form />
                </main>
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById("root"));
