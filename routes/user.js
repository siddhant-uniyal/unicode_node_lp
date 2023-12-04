const express = require("express");
const { register , getMyProfile , login , logout , follow , unfollow , uploadpic, allUsers} =  require("../controllers/user.js");
const  isAuthenticated  = require("../middlewares/auth.js");
const {singleUpload} = require("../middlewares/multer.js")
const router = express.Router();

router.post("/register" ,register)

router.post("/login" , login)
router.get("/logout" , isAuthenticated,logout)

router.get("/myprofile" , isAuthenticated ,getMyProfile)

router.post("/follow/:userId" , isAuthenticated , follow);
router.post("/unfollow/:userId" , isAuthenticated , unfollow);
router.post("/uploadpic" , isAuthenticated , singleUpload , uploadpic);
router.get("/allUsers",allUsers)




module.exports =  router;




