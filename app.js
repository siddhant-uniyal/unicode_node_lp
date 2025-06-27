const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/user.js");
const questionRouter = require("./routes/question.js");
const answerRouter =  require("./routes/answer.js");
const commentRouter =  require("./routes/comment.js");
const errorHandler = require("./middlewares/error.js");
const {config} =  require("dotenv");
const cors = require("cors");


const app = express();


app.use(express.static('./public'));

config({
    path:"./data/config.env",
})


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(userRouter)
app.use(questionRouter)
app.use(answerRouter)
app.use(commentRouter)
app.use(errorHandler)
app.use(cors())

module.exports.app = app;



