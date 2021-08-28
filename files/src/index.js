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

        class Message {
            constructor(owner, data) {
                this.owner = owner;
                this.data = data;
            }
        }

        sessionStorage.setItem("owner", this.state.value);

        let ws = new WebSocket("ws://localhost:8080/api/v1/chat");

        ws.onopen = function () {
            let message = new Message(
                sessionStorage.getItem("owner"),
                sessionStorage.getItem("owner")
            );
            ws.send(JSON.stringify(message));

            ws.onmessage = function (event) {
                let d = JSON.parse(event.data);
                console.log(`${d.owner}: ${d.data}`);
            };
        };

        /*
         *fetch("/api/v1/chat", {
         *    method: "POST",
         *    body: JSON.stringify(user),
         *})
         *    .then((responsive) => {
         *        if (responsive.status >= 400) {
         *            throw true;
         *        }
         *        return responsive.json();
         *    })
         *    .then((resp) => {
         *        console.log(resp);
         *    })
         *    .catch(() => {
         *        console.log("error");
         *    });
         */
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
                <h1 className="title">Title</h1>
                <Form />
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById("root"));
