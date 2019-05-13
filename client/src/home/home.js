import React, { Component } from "react";
import "./home.scss";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  FormFeedback
} from "reactstrap";
import io from "socket.io-client";
const socket = io("http://localhost:4000");
export default class Home extends Component {
  state = {
    name: "",
    invalid: false
  };
  render() {
    return (
      <div className="home-section">
        <Form>
          <FormGroup>
            <Label for="name">Email</Label>
            <Input
              bsSize="lg"
              name="name"
              id="name"
              value={this.state.name}
              onChange={event => this.onChangeInput(event)}
              placeholder="Enter your Name"
              invalid={this.state.invalid}
            />
            <FormFeedback>Oh noes! that name is already taken</FormFeedback>
            <FormText color="muted">
              Your Name will not be stored in the server.
            </FormText>
            <Button
              color="primary"
              size="lg"
              className="submit-btn"
              onClick={() => this.submitYourName()}
            >
              Submit
            </Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
  submitYourName() {
    let randomUserid = Math.floor(Math.random() * 10000000 + 1);
    if (this.state.name) {
      console.log(this.state.name);
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          name: this.state.name,
          userid: randomUserid
        })
      );
      socket.emit("login", {
        userid: randomUserid
      });
      this.props.history.push("./quiz");
    } else {
      this.setState({ invalid: true });
    }
  }

  onChangeInput(event) {
    this.setState({ name: event.target.value });
  }
}
