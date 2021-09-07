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
            let message = JSON.parse(m.data);
            this.setState({ users: message.users });

            if (message.byServer) {
                message.classMessage = "message--system";
            } else {
                if (message.owner === sessionStorage.getItem("owner")) {
                    message.classMessage = "message--user";
                } else {
                    message.classMessage = "message--other";
                }
            }

            let msgs = this.state.msgs;
            message.users = null;
            msgs.push(message);
            this.setState({ msgs: msgs });
        };

        window.addEventListener("unload", (ev) => {
            let message = new Message(
                sessionStorage.getItem("owner"),
                "has gone out to the chat",
                null,
                true
            );
            this.ws.send(JSON.stringify(message));
            this.setState({ value: "" });

            ev.returnValue = "";
        });
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
                <h1 className="title">Connected</h1>
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
            <form onSubmit={this.handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={this.state.value}
                        onChange={this.handleChange}
                        required
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

class Index extends React.Component {
    render() {
        return (
            <div>
                <Background />
                <h1 className="title">Welcome to Chat</h1>
                <Form />
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById("root"));
