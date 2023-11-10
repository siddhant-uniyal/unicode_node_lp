const express = require("express");
const { register , getMyProfile , login , logout , follow , unfollow , uploadpic} =  require("../controllers/user.js");
const  isAuthenticated  = require("../middlewares/auth.js");
const router = express.Router();




   

router.post("/register" ,register)

router.post("/login" , isAuthenticated , login)
router.get("/logout" , isAuthenticated,logout)

router.get("/myprofile" , isAuthenticated ,getMyProfile)

router.post("/follow/:userId" , isAuthenticated , follow);
router.post("/unfollow/:userId" , isAuthenticated , unfollow);
router.post("/uploadpic" , isAuthenticated , uploadpic);





module.exports =  router;