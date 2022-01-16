import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";


class SendEmailForm extends Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    return  (
      <div>
        <h3>Send an Email</h3>
        <form action="http://192.168.1.14:9000/sendEmail" method="POST">
          <input type="text" name="email" placeholder="Email(s) or 'mailing list'"/><br />
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

class MailingListForm extends Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    return  (
      <div>
        <h3>Join the Mailing List</h3>
        <form action="http://192.168.1.14:9000/addToMailingList" method="POST">
          <input type="text" name="name" placeholder="Name"/><br />
          <input type="text" name="email" placeholder="Email"/> <br />
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
    }

    

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Email</h1>
                </header>
                <SendEmailForm></SendEmailForm>
                <MailingListForm></MailingListForm>
            </div>
        );
    }
}

export default App;