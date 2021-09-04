import React from "react";
import ReactDOM from "react-dom";
import { v4 as uuidv4 } from "uuid";
import "./sass/style.scss";

class Message {
    constructor(owner, data) {
        this.owner = owner;
        this.data = data;
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

function DisplayElementsMap(props) {
    let iterator = props.elements.values();
    let slice = [];
    for (const item of iterator) {
        slice.push(item);
    }
    console.log(slice);
    return (
        <div>
            {slice.map((e) => (
                <h3>{e}</h3>
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
            users: new Map(),
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ws = new WebSocket(`${localStorage.getItem("host")}/api/v1/chat`);

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    componentDidMount() {
        this.ws.onmessage = (m) => {
            let message = JSON.parse(m.data);

            let owner = this.state.users.get(message.owner);
            if (owner === undefined) {
                this.state.users.set(message.owner, message.owner);
            }

            console.log(`${message.owner}: ${message.data}`);
            let msgs = this.state.msgs;
            msgs.push(`${message.owner}: ${message.data}`);
            this.setState({ msgs: msgs });
        };

        this.ws.onopen = () => {
            this.state.users.set(
                sessionStorage.getItem("owner"),
                sessionStorage.getItem("owner")
            );

            let message = new Message(
                sessionStorage.getItem("owner"),
                "has joined the chat"
            );
            console.log(message);
            this.ws.send(JSON.stringify(message));
            this.setState({ value: "" });
        };

        window.addEventListener("unload", (ev) => {
            let message = new Message(
                sessionStorage.getItem("owner"),
                "has gone out to the chat"
            );
            console.log(message);
            this.ws.send(JSON.stringify(message));
            this.setState({ value: "" });

            this.state.users.delete(sessionStorage.getItem("id"));
            ev.returnValue = "";
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        let message = new Message(
            sessionStorage.getItem("owner"),
            this.state.value
        );
        this.ws.send(JSON.stringify(message));
        this.setState({ value: "" });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <DisplayElementsSlice elements={this.state.msgs} />
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
                <DisplayElementsMap elements={this.state.users} />
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
