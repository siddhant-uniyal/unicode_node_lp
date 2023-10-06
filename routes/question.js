const express =  require("express")
const  { postQuestion , getQuestion, updateQuestion, deleteQuestion } = require("../controllers/question.js");
const isAuthenticated  =  require("../middlewares/auth.js");
const router = express.Router();




router.post("/question/post" , isAuthenticated, postQuestion);
router.get("/question/get" , isAuthenticated,getQuestion);

router.route("/question/:questionId")
.put( isAuthenticated,updateQuestion)
.delete( isAuthenticated, deleteQuestion)


module.exports =  router;