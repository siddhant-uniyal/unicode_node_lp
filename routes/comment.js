const express =  require("express")
const { newComment , getComment , updateComment , deleteComment} = require("../controllers/comment.js");
const  isAuthenticated  =  require("../middlewares/auth.js");
const router = express.Router();




router.post("/comment/:parentId" , isAuthenticated, newComment);
router.get("/comment/mycomments"  , isAuthenticated, getComment);

router.route("/comment/:commentId")
.put( isAuthenticated, updateComment)
.delete( isAuthenticated , deleteComment)


module.exports =  router;