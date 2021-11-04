import React from "react";
import ReactDOM from "react-dom";
import "./../sass/style.scss";
import Login from "./login";
import Background from "./background";

class Index extends React.Component {
    render() {
        return (
            <>
                <Background />
                <main className="main">
                    <p className="title title--login">Welcome To Chat</p>
                    <Login />
                </main>
            </>
        );
    }
}

export default Index;

ReactDOM.render(<Index />, document.getElementById("root"));
