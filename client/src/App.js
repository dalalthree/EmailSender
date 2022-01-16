import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";


class EmailForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return  (
      <div>
        <form action="http://localhost:9000/" method="POST">
          <input type="text" name="email" placeholder="Email(s)"/><br />
          <input type="text" name="subject" placeholder="Subject"/> <br />
          <textarea rows="10" name="content" placeholder="Message"></textarea> <br />
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }

    

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Email</h1>
                </header>
                <EmailForm></EmailForm>
                <p className="App-intro">{this.state.apiResponse}</p>
            </div>
        );
    }
}

export default App;