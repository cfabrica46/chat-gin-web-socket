import React from "react";

const DisplayInfo = (props) => {
    return (
        <div className="chat-info">
            <button
                onClick={() => props.onClickIndex()}
                class="fas fa-arrow-circle-left chat-exit"
            ></button>
            <h2 className="chat-idRoom">ROOM: {props.idRoom}</h2>
            <p
                onClick={() => props.onClickShow()}
                className="chat-number-users"
            >
                Users: {props.elements.length}
            </p>
        </div>
    );
};

export default DisplayInfo;
