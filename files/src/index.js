import React from "react";
import ReactDOM from "react-dom";
import "./sass/style.scss";

function Background() {
    return (
        <span>
            <span className="bg"></span>
            <span className="bg bg2"></span>
            <span className="bg bg3"></span>
        </span>
    );
}

function NewMessage(props) {
    console.log(props.msgs);
    return (
        <div>
            {props.msgs.map((msg) => (
                <h3>{msg}</h3>
            ))}
        </div>
    );
}

class FormChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ws = new WebSocket("wss://cfabrica46-chat.herokuapp.com/api/v1/chat");

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    //cambia
    componentDidMount() {
        this.ws.onmessage = (m) => {
            let message = JSON.parse(m.data);
            console.log(`${message.owner}: ${message.data}`);
            let msgs = this.state.msgs;
            msgs.push(`${message.owner}: ${message.data}`);
            this.setState({ msgs: msgs });
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        class Message {
            constructor(owner, data) {
                this.owner = owner;
                this.data = data;
            }
        }

        let message = new Message(
            sessionStorage.getItem("owner"),
            this.state.value
        );
        this.ws.send(JSON.stringify(message));

        this.props.handleMessage(this.state.value);
        this.setState({ value: "" });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <NewMessage msgs={this.props.msgs} />
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
            </form>
        );
    }
}

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msgs: [],
        };
        this.handleMessage = this.handleMessage.bind(this);
    }

    handleMessage(msg) {
        this.state.msgs.push(msg);
        console.log(this.state.msgs);
    }

    render() {
        return (
            <div>
                <Background />
                <h1 className="title">Connected</h1>
                <FormChat
                    handleMessage={this.handleMessage}
                    msgs={this.state.msgs}
                />
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
