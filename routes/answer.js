const express =  require("express")
const { newAnswer , getAnswer, updateAnswer, deleteAnswer } = require("../controllers/answer.js");
const  isAuthenticated  =  require("../middlewares/auth.js");
const router = express.Router();




router.post("/answer/:questionId" , isAuthenticated, newAnswer);
router.get("/answer/get"  , isAuthenticated, getAnswer);

router.route("/answer/:answerId")
.put( isAuthenticated, updateAnswer)
.delete( isAuthenticated , deleteAnswer)

router.post("/answer/upvote/:answerId" , isAuthenticated , upvoteAnswer);

router.post("/answer/downvote/:answerId" , isAuthenticated , downvoteAnswer);


module.exports =  router;