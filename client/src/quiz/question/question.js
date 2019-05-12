import React, { Component } from "react";

export default class Question extends Component {
  render() {
    return (
      <React.Fragment>
        <p className="lead">{this.props.question}</p>
      </React.Fragment>
    );
  }
}
