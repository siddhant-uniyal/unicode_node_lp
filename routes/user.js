const express = require("express");
const { register , getMyProfile , login , logout} =  require("../controllers/user.js");
const  isAuthenticated  = require("../middlewares/auth.js");
const router = express.Router();




   

router.post("/register" ,register)

router.post("/login" , isAuthenticated , login)
router.get("/logout" , isAuthenticated,logout)

router.get("/myprofile" , isAuthenticated ,getMyProfile)

router.post("/follow" , isAuthenticated , follow);
router.post("/unfollow" , isAuthenticated , unfollow);



module.exports =  router;