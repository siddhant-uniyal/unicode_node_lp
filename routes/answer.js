const express =  require("express")
const { newAnswer , getAnswer, updateAnswer, deleteAnswer } = require("../controllers/answer.js");
const  isAuthenticated  =  require("../middlewares/auth.js");
const router = express.Router();




router.post("/answer/:questionId" , isAuthenticated, newAnswer);
router.get("/answer/myanswers"  , isAuthenticated, getAnswer);

router.route("/answer/:answerId")
.put( isAuthenticated, updateAnswer)
.delete( isAuthenticated , deleteAnswer)


module.exports =  router;