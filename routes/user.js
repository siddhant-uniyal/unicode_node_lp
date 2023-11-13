const express = require("express");
const multer = require("multer");
const { register , getMyProfile , login , logout , follow , unfollow , uploadpic} =  require("../controllers/user.js");
const  isAuthenticated  = require("../middlewares/auth.js");
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
limits : {fileSize : 10*1024*1024} 
});



router.post("/register" ,register)

router.post("/login" , login)
router.get("/logout" , isAuthenticated,logout)

router.get("/myprofile" , isAuthenticated ,getMyProfile)

router.post("/follow/:userId" , isAuthenticated , follow);
router.post("/unfollow/:userId" , isAuthenticated , unfollow);
router.post("/uploadpic" , isAuthenticated , upload.array('profilepics' , 4) , uploadpic);





module.exports =  router;




