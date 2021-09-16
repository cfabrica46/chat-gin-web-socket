import React from "react";
import ReactDOM from "react-dom";
import { Chat } from "./chat.js";

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
                    autoFocus
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

export { Form };
