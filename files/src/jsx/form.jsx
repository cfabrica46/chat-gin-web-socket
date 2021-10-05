import React from "react";
import ReactDOM from "react-dom";
import { Chat } from "./chat";

class Form extends React.Component {
    state = {
        username: "",
        idRoom: "",
    };

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

    handleChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    };

    handleChangeRoom = (event) => {
        this.setState({ idRoom: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        fetch("/api/v1/login", {
            method: "POST",
            body: JSON.stringify({
                username: this.state.username,
                idRoom: this.state.idRoom,
            }),
        })
            .then((responsive) => {
                if (responsive.status >= 400) {
                    throw true;
                }
                return responsive.json();
            })
            .then((token) => {
                ReactDOM.render(
                    <Chat
                        token={token.token}
                        idRoom={this.state.idRoom}
                        owner={this.state.username}
                    />,
                    document.getElementById("root")
                );
            });
        // .catch(() => {
        // });
    };

    render() {
        return (
            <form className="form form-login" onSubmit={this.handleSubmit}>
                <label className="label" for="username">
                    Username
                </label>
                <input
                    autoFocus
                    name="username"
                    className="form--input-text"
                    type="text"
                    value={this.state.username}
                    onChange={this.handleChangeUsername}
                    required
                />
                <label className="label" for="room">
                    ID Room
                </label>
                <input
                    autoFocus
                    name="room"
                    className="form--input-text"
                    type="text"
                    value={this.state.room}
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
