import React from "react";
import { FormChat } from "./form_chat.js";
import { Background } from "./background";

class Chat extends React.Component {
    render() {
        return (
            <div>
                <Background />
                <main className="main">
                    <p className="title title--chat">Connected</p>
                    <FormChat handleMessage={this.handleMessage} />
                </main>
            </div>
        );
    }
}

export { Chat };