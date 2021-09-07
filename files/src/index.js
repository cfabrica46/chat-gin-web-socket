import React from "react";
import ReactDOM from "react-dom";
import "./sass/style.scss";

class Message {
    constructor(owner, data, users, byServer) {
        this.owner = owner;
        this.data = data;
        this.users = users;
        this.byServer = byServer;
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
            /*
             *            let message = new Message(
             *                "admin",
             *                sessionStorage.getItem("owner"),
             *                this.state.users,
             *                true
             *            );
             *
             *            this.ws.send(JSON.stringify(message));
             */

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

            /*
             *            if (message.owner !== sessionStorage.getItem("owner")) {
             *                if (
             *                    message.byServer === true &&
             *                    message.data === "has joined the chat"
             *                ) {
             *                    let users = this.state.users;
             *                    users.push(message.owner);
             *                    this.setState({ users: users });
             *                }
             *
             *                if (
             *                    message.byServer === true &&
             *                    message.data === "has gone out to the chat"
             *                ) {
             *                    const index = this.state.users.indexOf(message.owner);
             *                    if (index > -1) {
             *                        this.setState({
             *                            users: this.state.users.splice(index, 1),
             *                        });
             *                    }
             *                }
             *            }
             *
             */
            this.setState({ users: message.users });

            let msgs = this.state.msgs;
            msgs.push(`${message.owner}: ${message.data}`);
            this.setState({ msgs: msgs });

            /*
             *if (deletedUser === false) {
             *    this.setState({ users: message.users });
             *}
             */
        };

        window.addEventListener("unload", (ev) => {
            /*
             *const index = this.state.users.indexOf(
             *    sessionStorage.getItem("owner")
             *);
             *if (index > -1) {
             *    this.setState({ users: this.state.users.splice(index, 1) });
             *}
             */

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
