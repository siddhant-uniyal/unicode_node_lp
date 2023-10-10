const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
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

const register = async (req, res) => {
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

    res.json({
      success: true,
      message: "Successful registration",
      user,
      authToken,
    });
  } catch (e) {
    res.json({ Error: e.message });
  }
};

const getMyProfile = async (req, res) => {
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

const logout = (req, res) => {
  res.send("hello");
};

module.exports.login = login;
module.exports.register = register;
module.exports.getMyProfile = getMyProfile;
module.exports.logout = logout;
