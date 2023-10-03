const express = require("express");
const { register , getMyProfile , login , logout} =  require("../controllers/user.js");
const  { isAuthenticated } = require("../middlewares/auth.js");
const router = express.Router();




   

router.post("/register" ,register)

router.post("/login" , login)
router.get("/logout" , logout)

router.get("/myprofile" , isAuthenticated ,getMyProfile)



module.exports =  router;