const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


  
  const transporter = nodemailer.createTransport({
    service : "gmail",
   
    auth : {
      user : process.env.EMAIL,
      pass : process.env.PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }

  })







const login = async(req, res)=>{
  const user = await User.findOne({ _id: req.user.user_id });

  if (!user) return res.status(401).send("User doesn't exist");

  // const result = bcrypt.compare(
  //   req.body.password,
  //   user.password,
  //   (e, result) => {
  //     if (e) {
  //       return res.json({ Error: e.message });
  //     }
  //     return result;
  //   }
  // );

  // if (!result) res.status(400).send("Incorrect password , try again");

  res.send("Successful login attempt , welcome back");
};

const register = async(req, res)=>{
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user)
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });

    const hashedPassword = await bcrypt.hash(password, process.env.SALT);

    user = await User.create({ name, email, password: hashedPassword });

    const authToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET);

    const mailOptions = {
      from : process.env.EMAIL,
      to : req.body.email,
      subject : "Successful Registration",
      text : `Hi ${req.body.name}, you have successfully registered to our Quora Clone`
    }

    const info = await transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
          console.log(err.message);
      } else {
          console.log(data);
      }
  });

    res.json({
      success: true,
      message: "Successful registration and email sent",
      user,
      authToken,
      info
    });
  } catch (e) {
    res.json({ Error: e.message });
  }




};

const getMyProfile = async(req, res)=>{
  const user = await User.findOne({ _id: req.user });

  if (user) {
    res.status(200).json({
      success: true,
      user,
    });
  } else {
    res.status(404).send("User does not exist");
  }
};

const logout = async (req, res) => {
  res.send("hello");
};


const follow = async (req , res) =>{


    try{
    await User.findByIdAndUpdate(
      req.params.userId,
      {
        $push : {followers : req.user_id}
      }
    )
    }catch(err){
      return res.status(400).send("Followers of user couldn't be updated");
    }

    try{
      await User.findByIdAndUpdate(
        req_user,
        {
          $push : {following : req.params.id}
        }
      )
    }catch(err){
      return res.status(400).send("Following could not be updated properly");
    }

    res.status(201).json({
      success : true,
      message : "User followed successfully and following updated successfully",
      createdAnswer

  })
}


const unfollow = async (req , res) =>{



  try{
  await User.findByIdAndUpdate(
    req.params.userId,
    {
      $pull : {followers : req.user_id}
    }
  )
  }catch(err){
    return res.status(400).send("Followers of user couldn't be updated");
  }

  try{
    await User.findByIdAndUpdate(
      req_user,
      {
        $pull : {following : req.params.id}
      }
    )
  }catch(err){
    return res.status(400).send("Following could not be updated properly");
  }

  res.status(201).json({
    success : true,
    message : "User unfollowed successfully and following of user updated successfully",
    createdAnswer

})
}

