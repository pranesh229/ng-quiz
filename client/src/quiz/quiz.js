import React, { Component } from "react";
import "./quiz.scss";
import Question from "./question/question";
import { Button } from "reactstrap";
import Rank from "./rank/rank";
import io from "socket.io-client";
const socket = io("http://localhost:4000");
export default class Quiz extends Component {
  state = {
    questions: [],
    currentQuestion: "",
    currentIndex: 0
  };
  constructor() {
    super();
    if (socket) {
      console.log("connected to socket");
      socket.on("questions", data => {
        console.log(data);
        this.setState({
          questions: data.questions,
          currentQuestion: data.questions[0]
        });
      });
    }
  }
  render() {
    let questionUI = this.createQuestions(this.state.currentQuestion);
    return (
      <div className="quiz-section">
        {questionUI}

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
  createQuestions(question) {
    console.log(question);
    return <Question question={question} />;
  }
  submitYes() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    socket.emit("submit Answer", {
      questionIndex: this.state.currentIndex,
      question: this.state.currentQuestion,
      answer: "Yes",
      userid: user.userid
    });
    this.nextQuestion();
  }
  submitNo() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    socket.emit("submit Answer", {
      questionIndex: this.state.currentIndex,
      question: this.state.currentQuestion,
      answer: "No",
      userid: user.userid
    });
    this.nextQuestion();
  }
  nextQuestion() {
    if (this.state.currentIndex < this.state.questions.length - 1) {
      this.setState({
        currentIndex: this.state.currentIndex + 1,
        currentQuestion: this.state.questions[this.state.currentIndex + 1]
      });
    } else {
      this.props.history.push("./thankyou");
    }
  }
}
