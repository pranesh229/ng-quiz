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

  io.on("connection", socket => {
    let questionCollection = db.collection("questions");
    let answerCollection = db.collection("answers");
    let sendStatus = s => {
      socket.emit("status", s);
    };

    questionCollection.find().toArray((error, result) => {
      if (error) {
        throw error;
      }
      console.log(result);
      socket.emit("questions", result);
    });

    answerCollection
      .find({ question: "Does HTML compile ?" })
      .toArray((error, result) => {
        if (error) {
          throw error;
        }
        console.log("answers-->" + JSON.stringify(result));
      });
    socket.on("submit Answer", data => {
      let question = data.question;
      let answer = data.answer;
      let userid = data.userid;
      if (question && answer) {
        answerCollection.insert(
          {
            question: question,
            answer: answer,
            userid: userid
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
