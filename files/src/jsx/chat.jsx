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
                        handleMessage={this.handleMessage}
                        owner={this.props.username}
                        idRoom={this.props.idRoom}
                    />
                </main>
            </div>
        );
    }
}

export { Chat };
