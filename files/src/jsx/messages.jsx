import React from "react";

const DisplayMessages = (props) => {
    return (
        <div className="chat-msgs" id="chat-msgs">
            {props.messages.map((message) => (
                <h3 className={`chat-msg ${message.msgClass}`}>
                    {message.msgClass === "chat-msg--system"
                        ? `${message.owner} ${message.body}`
                        : null}
                    {message.msgClass === "chat-msg--other"
                        ? `${message.owner}: ${message.body}`
                        : null}
                    {message.msgClass === "chat-msg--user"
                        ? `${message.body} :${message.owner}`
                        : null}
                </h3>
            ))}

            {props.pendingMsgs.map((message) => (
                <h3 className={`chat-msg ${message.msgClass}`}>
                    {message.body} :{message.owner}
                </h3>
            ))}
        </div>
    );
};

export default DisplayMessages;
