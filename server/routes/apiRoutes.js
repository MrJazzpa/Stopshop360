const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");
const Code = require("../models/codesModel");
const { userRegValidationRules, 
  regValidate,
  checkCodeRules,
  codeValidate,
} = require('../../middleware/validator');

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wizzyjazzpa4blinks@gmail.com",
    pass: "Wizzyjazzpa@1",
  },
});

router.post("/register", userRegValidationRules(), regValidate, async (req, res) => {
  const { email } = req.body;
  const getUser = await User.findOne({ email });
  if (getUser) {
    return res
      .json({
        _id: getUser._id,
        message: "Please Activate Your Account",
      })
      .status(201);
  }

  const salt = await bcrypt.genSalt(10);
  const encrypt_password = await bcrypt.hash(req.body.password, salt);
  const verify_code = Math.floor(1000 + Math.random() * 9000);
  const mailOptions = {
    from: "wizzyjazzpa4blinks@gmail.com",
    to: req.body.email,
    subject: "Welcome",
    text:
      "Hello! " +
      req.body.lastname +
      "\n" +
      "welcome to Stopshop360 \n" +
      " your Verification code is:" +
      verify_code,
  };
  const register = new User({
    email: req.body.email,
    password: encrypt_password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
  });
  const newUser = await register.save();
   console.log(newUser);

   const emailCode = await new Code({
     token: verify_code,
     email: req.body.email,
     userId: newUser._id
   })
   await emailCode.save();
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error.message);
          return res.status(400).json({ status: 400, message: "Request not completed" });
        } 
         return res.status(200).json({ status: 200, message:"successful registration", _id: newUser._id });
      });
});







router.post("/login", async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ status: 200, msg: "Login was successful" });
    });
  })(req, res, next);
});

router.post(
  "/verify_code",
  checkCodeRules(),
  codeValidate,
  async (req, res) => {
    try {
      const { token, userId } = req.body;
      const getUser = await User.findById(userId);
      if (getUser) {
        const tokenRecord = await Tokens.findOne({ token });
        if (tokenRecord) {
          const diff = Math.abs(new Date() - new Date(tokenRecord.createdAt));
          const minutes = Math.floor(diff / 1000 / 60);
          if (Math.floor(minutes) >= 15) {
            const removedToken = tokenRecord.remove();
            return res
              .status(400)
              .json({ message: "Token is expired, please request new token" });
          }
          const updateUser = await User.updateOne(
            { _id: userId },
            { $set: { isConfirmed: 1 } }
          );
          const removedToken = tokenRecord.remove();
          return res.status(200).json({
            _id: getUser._id,
            name: getUser.name,
            email: getUser.email,
            isConfirmed: 1,
            isAdmin: getUser.isAdmin,
            isMarketer: getUser.isMarketer,
            token: generateToken(getUser),
          });
        }
        return res
          .status(400)
          .send({ message: "Token does not exist, please request new" });
      }
      return res.status(401).send({ message: "Bad request, user not found" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
