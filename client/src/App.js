import React, { Component } from "react";
import "./App.scss";
import io from "socket.io-client";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Quiz from "./quiz/quiz";
import Home from "./home/home";
import Thankyou from "./thankyou/thankyou";
const socket = io("http://localhost:4000");

export default class App extends Component {
  constructor() {
    super();
    if (socket) {
      console.log("connected to socket");
      socket.on("output", data => {
        console.log(data);
      });
    }
  }

  render() {
    return (
      <div className="App container-fluid">
        <header className="App-header">
          <h1>ng-quiz</h1>
        </header>
        <section>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/quiz" component={Quiz} />
              <Route path="/thankyou" component={Thankyou} />
            </Switch>
          </BrowserRouter>
        </section>
      </div>
    );
  }
}
