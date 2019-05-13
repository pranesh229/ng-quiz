// import TestOne from "./src/test-one";
// import TestTwo from "./src/test-two";
import * as mongo from "mongodb";
import * as socketio from "socket.io";
import * as assert from "assert";

// let testOne = new TestOne();
// let testTwo = new TestTwo();
const io = socketio.listen(4000).sockets;
const url = "mongodb+srv://admin:admin@ng-quiz-1rfmw.mongodb.net/test";
let questionsArray = [
  "Does HTML compile ?",
  ".map function is faster than .forEach function."
];
let questionAnswerArray = [
  { question: "Does HTML compile ?", answer: "No" },
  { question: ".map function is faster than .forEach function.", answer: "Yes" }
];
var USERID_GLB = null;
mongo.MongoClient.connect(url, (err, client) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db("quiz");
  let questionCollection = db.collection("questions");
  let answerCollection = db.collection("answers");
  let qaCollection = db.collection("questionanwers");
  let scorecardCollection = db.collection("scorecard");
  // qaCollection.insertMany(questionAnswerArray);
  io.on("connection", socket => {
    let sendStatus = s => {};

    questionCollection.find().toArray((error, result) => {
      if (error) {
        throw error;
      }
      console.log(result);
      questionsArray = result[0];
      socket.emit("questions", result[0]);
    });

    answerCollection
      .find({ question: "Does HTML compile ?" })
      .toArray((error, result) => {
        if (error) {
          throw error;
        }
        console.log("answers-->" + JSON.stringify(result));
      });
    socket.on("login", data => {
      USERID_GLB = data.userid;
    });
    function sendRankData(userid) {
      scorecardCollection.find({ userid: userid }).toArray((error, result) => {
        if (error) {
          throw error;
        }
        console.log("scorecard--->" + JSON.stringify(result));
        let userScore = 0;
        if (result.length != 0) {
          userScore = result[0].score;
        }
        scorecardCollection
          .find({ score: { $gt: userScore } })
          .count((error, result) => {
            if (error) {
              throw error;
            }
            console.log("count--->" + result);
            let userRank = result + 1;
            scorecardCollection.distinct("score", (error, result2) => {
              if (error) {
                throw error;
              }
              console.log("distinct---" + result2.length);
              let totalRanks = result2.length;
              console.log(
                "rank" +
                  JSON.stringify({
                    rank: userRank,
                    total: totalRanks
                  })
              );
              socket.emit("rank", {
                rank: userRank,
                total: totalRanks
              });
            });
          });
      });
    }

    socket.on("submit Answer", data => {
      let question = data.question;
      let answer = data.answer;
      let userid = data.userid;
      let questionIndex = data.questionIndex;
      console.log("---" + questionAnswerArray[questionIndex].answer);
      let isCorrect = questionAnswerArray[questionIndex].answer == answer;
      if (isCorrect) {
        scorecardCollection.findOneAndUpdate(
          { userid: userid },
          { $inc: { score: 1 } },
          { new: true, upsert: true },
          (err, result) => {
            if (err) {
              throw err;
            }
            sendRankData(userid);
            console.log(result);
          }
        );
      } else {
        sendRankData(userid);
      }

      // if (question && answer) {
      //   answerCollection.insertOne(
      //     {
      //       question: question,
      //       answer: answer,
      //       userid: userid,
      //       isCorrect: isCorrect
      //     },
      //     () => {
      //       io.emit("output", [data]);
      //       sendStatus({
      //         message: "message sent",
      //         clear: true
      //       });
      //     }
      //   );
      // } else {
      //   sendStatus("Please select a result");
      // }
    });
  });
  //   client.close();
});
