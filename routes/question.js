const express =  require("express")
const  { postQuestion , getQuestion, updateQuestion, deleteQuestion, searchCategory , upvoteQuestion , downvoteQuestion, allQuest} = require("../controllers/question.js");
const isAuthenticated  =  require("../middlewares/auth.js");
const isAdmin = require("../middlewares/verifyLevel.js")
const router = express.Router();




router.post("/question/post" , isAuthenticated, postQuestion);
router.get("/question/get" , isAuthenticated,getQuestion);

router.route("/question/:questionId")
.put( isAuthenticated,updateQuestion)
.delete( isAuthenticated, isAdmin , deleteQuestion)

router.post("/question/search" , isAuthenticated , searchCategory);

router.post("/question/upvote/:questionId" , isAuthenticated , upvoteQuestion);

router.post("/question/downvote/:questionId" , isAuthenticated , downvoteQuestion);
router.get('/question/all',allQuest)
module.exports =  router;