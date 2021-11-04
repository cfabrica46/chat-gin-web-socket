import React from "react";
import Chat from "./chat";
import Background from "./background";

class ContainerChat extends React.Component {
    render() {
        return (
            <div>
                <Background />
                <main className="main">
                    <Chat
                        token={this.props.token}
                        idRoom={this.props.idRoom}
                        owner={this.props.owner}
                    />
                </main>
            </div>
        );
    }
}

export default ContainerChat;
