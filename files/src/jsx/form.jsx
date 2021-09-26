import React from "react";
import ReactDOM from "react-dom";
import { Chat } from "./chat";

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                username: "",
                room: "",
            },
        };

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
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

    handleChangeUsername(event) {
        this.setState({ formData: { username: event.target.value } });
    }

    handleChangeRoom(event) {
        this.setState({ formData: { room: event.target.value } });
    }

    handleSubmit(event) {
        //fetch to login
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
                    value={this.state.formData.username}
                    onChange={this.handleChangeUsername}
                    required
                />
                <label className="label" for="room">
                    ID Room
                </label>
                <input
                    autoFocus
                    name="room"
                    className="form--input-room"
                    type="text"
                    value={this.state.formData.room}
                    onChange={this.handleChangeRoom}
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
