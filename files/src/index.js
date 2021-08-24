import React from "react";
import ReactDOM from "react-dom";
import "./sass/style.scss";

function Background() {
    return (
        <span>
            <span className="bg"></span>
            <span className="bg bg2"></span>
            <span className="bg bg3"></span>
        </span>
    );
}

//define fetch on button to send post request
function SignIn() {
    return (
        <form>
            <label className="form__label">Insert Your Nick: </label>
            <input className="form__input" type="text" required />
            <button className="form__submit">Enter</button>
        </form>
    );
}

class Index extends React.Component {
    render() {
        return (
            <div>
                <Background />
                <h1 className="title">Title</h1>
                <SignIn />
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById("root"));
