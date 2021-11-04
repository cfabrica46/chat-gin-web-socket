import React from "react";

const DisplayMessages = (props) => {
    return (
        <div className="chat-msgs" id="chat-msgs">
            {props.messages.map((message) => (
                <div>
                    <h3 className={`chat-name chat-name--${message.msgClass}`}>
                        {message.msgClass === "system" ? null : message.owner}
                    </h3>
                    <h4 className={`chat-msg chat-msg--${message.msgClass}`}>
                        {message.msgClass === "system"
                            ? `${message.body} ${message.owner}`
                            : message.body}
                    </h4>
                </div>
            ))}

            {props.pendingMsgs.map((message) => (
                <div>
                    <h3 className={`chat-name chat-name--${message.msgClass}`}>
                        {message.owner}
                    </h3>
                    <h4 className={`chat-msg chat-msg--${message.msgClass}`}>
                        {message.body}
                    </h4>
                </div>
            ))}
        </div>
    );
};

export default DisplayMessages;
