import React, { Component } from "react";
import "./rank.scss";
import io from "socket.io-client";
const socket = io("http://localhost:4000");
export default class Rank extends Component {
  state = {
    rank: null,
    total: null
  };
  constructor() {
    super();
  }
  componentDidMount() {
    if (socket) {
      console.log("connected to socket");
      socket.on("rank", data => {
        console.log("rankData" + data);
        this.setState({ rank: data.rank, total: data.total });
      });
    }
  }
  render() {
    return (
      <div className="text-center">
        <h4>Current Rank</h4>
        <p className="lead">
          {this.state.rank} out of {this.state.total}
        </p>
      </div>
    );
  }
}
