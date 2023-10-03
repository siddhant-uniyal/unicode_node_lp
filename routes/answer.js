const express =  require("express")
const { newAnswer , getAnswer, updateAnswer, deleteAnswer } = require("../controllers/answer.js");
const  { isAuthenticated } =  require("../middlewares/auth.js");
const router = express.Router();




router.post("/answer/:questionId" , newAnswer);
router.get("/answer/myanswers"  , getAnswer);

router.route("/answer/:answerId")
.put(  updateAnswer)
.delete( deleteAnswer)


module.exports =  router;