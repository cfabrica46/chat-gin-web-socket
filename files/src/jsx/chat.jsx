import React from "react";
import { FormChat } from "./form_chat";
import { Background } from "./background";

class Chat extends React.Component {
    render() {
        return (
            <div>
                <Background />
                <main className="main">
                    <p className="title title--chat">Connected</p>
                    <FormChat
                        token={this.props.token}
                        idRoom={this.props.idRoom}
                        owner={this.props.owner}
                    />
                </main>
            </div>
        );
    }
}

export { Chat };
