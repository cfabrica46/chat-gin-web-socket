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

    componentDidMount() {
        this.ws.onmessage = function (event) {
            let d = JSON.parse(event.data);
            console.log(`${d.owner}: ${d.data}`);
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
            msgs: [""],
        };
        this.handleMessage = this.handleMessage.bind(this);
    }

    handleMessage(msg) {
        this.state.msgs.push(msg);
        this.setState({ msgs: msgs });
    }

    render() {
        return (
            <div>
                <Background />
                <h1 className="title">Connected</h1>
                <div className="chat-div">{this.state.msgs}</div>
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
