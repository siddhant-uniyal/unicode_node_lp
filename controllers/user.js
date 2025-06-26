const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2
const getDataUri = require("../utils/dataUri.js");
const ErrorHandler = require("../utils/errorHandler.js");


const login = async(req, res)=>{
  try{
  const {email , password} = req.body;
  const user = await User.findOne({ email });


  if (!user) return next(new ErrorHandler("User does not exist" , 400));
  const result = await bcrypt.compare(
    password,
    user.password,
    // (e, result) => {
    //   if (e) {
    //     return res.json({ Error: e.message });
    //   }
    //   return result;
    // }
    //linting
  );

  console.log(result);

  if (!result) return next(new ErrorHandler("Incorrect password , try again" , 400));

  const authToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET , {expiresIn:"1d"}); //expires in

  //res.json("Successful login attempt , welcome back");

  res.status(200).json({
    "success" : "true",
    authToken,
  })

}
catch(err){
  return res.status(400).send(err.message);
}
};

const register = async(req, res)=>{
  const { name, email, password ,auth } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user)
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });

    const hashedPassword =  await bcrypt.hash(password, process.env.SALT);

    user = await User.create({ name, email, password: hashedPassword , auth});

    const authToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET ); //expires in

    // let transporter = nodemailer.createTransport({
    //   service : "gmail",
     
    //   auth : {
    //     user : process.env.EMAIL,
    //     pass : process.env.PASSWORD
    //   }
    // })
    
    // const mailOptions = {
    //   from : process.env.EMAIL,
    //   to : req.body.email,
    //   subject : "Successful Registration",
    //   text : `Hi ${req.body.name}, you have successfully registered to our Quora Clone`
    // }

  //   const info = await transporter.sendMail(mailOptions, function(err, data) {
  //     if(err) {
  //         console.log(err.message);
  //     } else {
  //         // console.log(data);
  //         console.log('Email sent successfully')
  //     }
  // });

  // console.log(process.env.PASSWORD);
    res.json({
      success: true,
      message: "Successful registration",
      user,
      authToken,
    });
  } catch (e) {
    res.status(400).json({ Error: e.message });
  }




};

const getMyProfile = async(req, res)=>{
  const user = await User.findOne({ _id: req.user.user_id });

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


const follow = async (req , res , next) =>{


    try{
    await User.findByIdAndUpdate(
      req.params.userId,
      {
        $push : {followers : req.user.user_id}
      }
    )
    }catch(err){
      return next(new ErrorHandler("Followers could not be updated" , 400));
    }

    try{
      await User.findByIdAndUpdate(
        req.user.user_id,
        {
          $push : {following : req.params.id}
        }
      )
    }catch(err){
      return next(new ErrorHandler("Following could not be updated" , 400));
    }

    res.status(200).json({
      success : true,
      message : "User followed successfully and following updated successfully",

  })
}


const unfollow = async (req , res , next) =>{



  try{
  await User.findByIdAndUpdate(
    req.params.userId,
    {
      $pull : {followers : req.user.user_id}
    }
  )
  }catch(err){
    return next(new ErrorHandler("Followers of users could not be updated" , 400));
  }

  try{
    await User.findByIdAndUpdate(
      req.user.user_id,
      {
        $pull : {following : req.params.id}
      }
    )
  }catch(err){
    return next(new ErrorHandler("Following could not be updated" , 400));
  }

  res.status(200).json({
    success : true,
    message : "User unfollowed successfully and following of user updated successfully",

})
}

const uploadpic = async (req, res , next) => {
  try {

    const file = req.file;


    if(!file){
      return next(new ErrorHandler("Please select a file to upload" , 400));
    }

    const fileUri = getDataUri(file);

    console.log(fileUri.content);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    });
    

    const mycloud = await cloudinary.uploader.upload(fileUri.content);
    
    const user = await User.findByIdAndUpdate(
      {_id : req.user.user_id},
      {
      $set: {
        profilePictureCloudinary: mycloud.secure_url
      }
    },
    { new: true });
    

    res.status(200).json({
      success:'true',
       message: 'Profile picture(s) uploaded successfully', 
       user });
  } catch (err) {
    console.log(err.message);
    return next(new ErrorHandler("File could not be updated properly" , 400));
  }
};


module.exports = {login , register , unfollow , follow , getMyProfile , logout , uploadpic};
