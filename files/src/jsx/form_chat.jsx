import React from "react";
import ReactDOM from "react-dom";
import { Index } from "./index";
import DisplayInfo from "./chat_info";
import DisplayUsers from "./users";
import DisplayMessages from "./messages";

class Message {
    constructor(token, body) {
        this.token = token;
        this.body = body;
    }
}

class FormChat extends React.Component {
    state = {
        value: "",
        msgs: [],
        users: [],
        showUsers: false,
        loaded: false,
    };

    wrapperRef = React.createRef();

    ws = new WebSocket(`${localStorage.getItem("host")}/api/v1/chat`);

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    };

    handleShowUsers = () => {
        this.setState({ showUsers: true });
    };

    handleOcultUsers = () => {
        this.setState({ showUsers: false });
    };

    handleIndex = () => {
        this.ws.close();
        ReactDOM.render(<Index />, document.getElementById("root"));
    };

    scrollDown = () => {
        let msgsDiv = document.getElementById("chat-msgs");
        msgsDiv.scrollTop = msgsDiv.scrollHeight;
    };

    handleClickOutside = (event) => {
        if (
            this.wrapperRef.current &&
            !this.wrapperRef.current.contains(event.target)
        ) {
            this.handleOcultUsers();
        }
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);

        this.ws.onopen = () => {
            let message = new Message(this.props.token, "");
            this.ws.send(JSON.stringify(message));
        };

        this.ws.onmessage = (m) => {
            this.setState({ loaded: true });

            let ping = false;
            let messageClass;
            let message = JSON.parse(m.data);

            if (message.usersConnected) {
                this.setState({ users: message.usersConnected });
                return;
            }

            if (message.isStatusMessage) {
                if (message.msg.body === "has joined the chat") {
                    let newUsers = this.state.users;
                    newUsers.push(message.owner);
                    this.setState({ users: newUsers });
                }

                if (message.msg.body === "has gone out to the chat") {
                    let newUsers = arrayRemove(this.state.users, message.owner);
                    this.setState({ users: newUsers });
                }

                messageClass = "chat-msg--system";
                if (message.msg.body === "ping") {
                    ping = true;
                }
            } else {
                if (message.owner === this.props.owner) {
                    for (let i = this.state.msgs.length - 1; i >= 0; i--) {
                        let newMsgs = this.state.msgs;
                        if (
                            message.msg.body === newMsgs[i].body &&
                            newMsgs[i].msgClass === "chat-msg--sending"
                        ) {
                            newMsgs[i].msgClass = "chat-msg--user";
                            this.setState({ msgs: newMsgs });
                            break;
                        }
                    }
                    return;
                } else {
                    messageClass = "chat-msg--other";
                }
            }

            let myMsg = {
                owner: message.owner,
                body: message.msg.body,
                msgClass: messageClass,
                isStatusMessage: message.isStatusMessage,
            };

            if (!ping) {
                let newMsgs = this.state.msgs;
                newMsgs.push(myMsg);
                this.setState({ msgs: newMsgs });
            }

            this.scrollDown();
        };
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleSubmit = (event) => {
        event.preventDefault();

        //write message in div
        let myMsg = {
            owner: this.props.owner,
            body: this.state.value,
            msgClass: "chat-msg--sending",
            isStatusMessage: false,
        };

        let newMsgs = this.state.msgs;
        newMsgs.push(myMsg);
        this.setState({ msgs: newMsgs });

        // Send Message
        let message = new Message(this.props.token, this.state.value);

        this.ws.send(JSON.stringify(message));
        this.setState({ value: "" });
    };

    render() {
        return (
            <>
                {this.state.loaded ? (
                    <div className="chat" id="chat">
                        <DisplayInfo
                            onClickIndex={() => this.handleIndex()}
                            onClickShow={() => this.handleShowUsers()}
                            onClickOcult={() => this.handleOcultUsers()}
                            elements={this.state.users}
                            showUsers={this.state.showUsers}
                            idRoom={this.props.idRoom}
                        />
                        <DisplayMessages messages={this.state.msgs} />
                        <form
                            className="form form-message"
                            onSubmit={this.handleSubmit}
                        >
                            <input
                                autoFocus
                                className="chat-input--message"
                                type="text"
                                name="message"
                                value={this.state.value}
                                onChange={this.handleChange}
                                required
                            />
                            <label
                                for="mySubmit"
                                className="chat-submit-container"
                            >
                                <i class="fas fa-chevron-right chat-input--submit"></i>
                                <input
                                    id="mySubmit"
                                    type="submit"
                                    className="hidden"
                                />
                            </label>
                        </form>
                        {this.state.showUsers && (
                            <div ref={this.wrapperRef}>
                                <DisplayUsers
                                    onClickOcult={() => this.handleOcultUsers()}
                                    elements={this.state.users}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div class="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                )}
            </>
        );
    }
}

export { FormChat };
