const express =  require("express")
const  { newQuestion , getQuestion, updateQuestion, deleteQuestion } = require("../controllers/question.js");
const { isAuthenticated } =  require("../middlewares/auth.js");
const router = express.Router();




router.post("/question/newquestion" ,  newQuestion);
router.get("/question/myquestions" ,  getQuestion);

router.route("/question/:questionId")
.put( updateQuestion)
.delete(  deleteQuestion)


module.exports =  router;