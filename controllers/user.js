const { User } = require("../models/User.js");
const { sendCookie } =  require("../utils/features.js");
const  bcrypt = require("bcrypt");



const login = async (req, res, next) => {

  const { name , email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return res.send("Invalid Email of Password");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.send("Invalid Email of Password");

  sendCookie(user, res, `Welcome back , ${user.name}`, 200);
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return res.status(404).json({
      success: false,
      message: "User already exists",
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({ name, email, password: hashedPassword });

  sendCookie(user, res, "Registered Successfully", 201);
};

const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: "lax",
      secure: false,
    })
    .json({
      success: true,
      user: req.user,
    });
};


module.exports.login = login;
module.exports.register = register;
module.exports.getMyProfile = getMyProfile;
module.exports.logout = logout;
