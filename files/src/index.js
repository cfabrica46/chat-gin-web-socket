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

//define fetch on button to send post request
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
        const user = { username: this.state.value };

        fetch("/api/v1/chat", {
            method: "POST",
            body: JSON.stringify(user),
        })
            .then((responsive) => {
                if (responsive.status >= 400) {
                    throw true;
                }
                return responsive.json();
            })
            .then((resp) => {
                console.log(resp);
            })
            .catch(() => {
                console.log("error");
            });
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
