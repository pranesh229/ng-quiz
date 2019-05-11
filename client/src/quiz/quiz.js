import React, { Component } from "react";
import "./quiz.scss";
import Question from "./question/question";
import { Button } from "reactstrap";
import Rank from "./rank/rank";
export default class Quiz extends Component {
  render() {
    return (
      <div className="quiz-section">
        <Question />
        <Button
          color="primary"
          size="lg"
          className="answer-button pull-left"
          onClick={() => this.submitYes()}
        >
          Yes
        </Button>
        <Button
          color="secondary"
          size="lg"
          className="answer-button pull-right"
          onClick={() => this.submitNo()}
        >
          No
        </Button>
        <Rank />
      </div>
    );
  }
}
