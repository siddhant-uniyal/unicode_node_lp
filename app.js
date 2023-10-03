const express = require("express");

const userRouter = require("./routes/user.js");
const questionRouter = require("./routes/question.js");
const answerRouter =  require("./routes/answer.js");

const {config} =  require("dotenv");
const cookieParser =  require("cookie-parser");

const app = express();

config({
    path:"./data/config.env",
})


app.use(cookieParser())
app.use(express.json())
app.use(userRouter)
app.use(questionRouter)
app.use(answerRouter)

module.exports.app = app;



