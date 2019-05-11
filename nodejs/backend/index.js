import TestOne from "./src/test-one";
import TestTwo from "./src/test-two";
import * as mongo from "mongodb";
import * as socketio from "socket.io";
import * as assert from "assert";

// let testOne = new TestOne();
// let testTwo = new TestTwo();
const io = socketio.listen(4000).sockets;
const url = "mongodb+srv://admin:admin@ng-quiz-1rfmw.mongodb.net/test";
mongo.MongoClient.connect(url, (err, client) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db("quiz");

  io.on("connection", (socket) => {
    let quizAnswers = db.collection("questions");
    let sendStatus = s => {
        socket.emit("status", s);
    };

    quizAnswers.find().toArray((error, result) => {
      if (error) {
        throw error;
      }
      console.log(result);
      socket.emit("output", result);
    });
    socket.on("input", data => {
      let question = data.question;
      let answer = data.answer;
      if (question && answer) {
        quizAnswers.insert(
          {
            question: question,
            answer: answer
          },
          () => {
            io.emit("output", [data]);
            sendStatus({
              message: "message sent",
              clear: true
            });
          }
        );
      } else {
        sendStatus("Please select a result");
      }
    });
  });
//   client.close();
});
