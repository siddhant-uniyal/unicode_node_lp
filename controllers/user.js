const  User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateEmail =(inputText)=>{
  const patternToMatch = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if(inputText.value.match(patternToMatch)) return true;
  else return false;
}

const login = async (req, res, next) => {

  const {email} = req.body;

  if(!validateEmail(email)) return res.status(400).send("Please enter valid email ID");

  const user = await User.findOne({_id : req.user.user_id});

  if (!user) return res.status(401).send("Invalid Email of Password");

  res.send("Successful login attempt , welcome back");
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try{
  let user = await User.findOne({ email });

  if (user)
    return res.status(404).json({
      success: false,
      message: "User already exists",
    });

  const hashedPassword = await bcrypt.hash(password, process.env.SALT);

  user = await User.create({ name, email, password: hashedPassword });

  const authToken = jwt.sign({user_id : user._id},process.env.JWT_SECRET);

  res.json({
    success : true,
    message : "Successful registration",
    user,
    authToken
  })



  }catch(e){
    res.json({"Error" : e.message});
  }

};

const getMyProfile = async (req, res) => {

  const user = await User.findOne({_id : req.user});

  if(user){
  res.status(200).json({
    success: true,
    user,
  });
  }

  else{
    res.status(404).send("User does not exist");
  }
};

const logout = (req, res) => {
  res.send("hello");
};


module.exports.login = login;
module.exports.register = register;
module.exports.getMyProfile = getMyProfile;
module.exports.logout = logout;
