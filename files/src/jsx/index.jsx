import React from "react";
import ReactDOM from "react-dom";
import "./../sass/style.scss";
import { Form } from "./form";
import { Background } from "./background";

class Index extends React.Component {
    render() {
        return (
            <div>
                <Background />
                <main className="main">
                    <p className="title title--login">Welcome To Chat</p>
                    <Form />
                </main>
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById("root"));
