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

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ws = new WebSocket("ws://localhost:8080/api/v1/chat");

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
    }

    render() {
        return (
            <div>
                <Background />
                <h1 className="title">Connected</h1>
                <input
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    required
                />
                <input
                    type="submit"
                    value="Submit"
                    onClick={this.handleSubmit}
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
