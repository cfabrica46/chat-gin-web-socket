import React from "react";
import ReactDOM from "react-dom";
import "./../sass/style.scss";
import { Form } from "./form";
import { Background } from "./background";

class Index extends React.Component {
    render() {
        return (
            <>
                <Background />
                <main className="main">
                    <p className="title title--login">Welcome To Chat</p>
                    <Form />
                </main>
            </>
        );
    }
}

export { Index };

ReactDOM.render(<Index />, document.getElementById("root"));
