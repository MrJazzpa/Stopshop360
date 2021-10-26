const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const passport = require("passport");
const User = require("../models/userModel");
const Code = require("../models/codesModel");
const data = require("../../startup/data");
// const imageUpload = require('../../assets/images');
const {
  userRegValidationRules,
  regValidate,
  checkCodeRules,
  codeValidate,
  userValidationRules,
  validate,
} = require("../../middleware/validator");

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',  
  port: 465,
  secure: false,
  auth: {
    user:'quickstopshop360@gmail.com',
    pass: 'Stopshop360@1',
  },
});

router.get("/seed", async(req, res) => {
    const createdUsers = await User.insertMany(data.users);
    res.send({createdUsers});
}


);

router.post(
  "/register",
  userRegValidationRules(),
  regValidate,
  async (req, res) => {
    const { email } = req.body;
    const getUser = await User.findOne({ email, isConfirmed: 0 });
    if (getUser) {
      return res.status(200).send({
        status: 200,
        _id: getUser._id,
        message: "Please Activate Your Account",
      });
    }
    const getConfirmedUser = await User.findOne({ email, isConfirmed: 1 });
    if (getConfirmedUser) {
      let extractedErrors = [];
      extractedErrors.push({
        msg: "You are already registered, please login to continue",
      });
      return res.status(400).send({ extractedErrors, status: 400 });
    }
    const salt = await bcrypt.genSalt(10);
    const encrypt_password = await bcrypt.hash(req.body.password, salt);
    const verify_code = Math.floor(1000 + Math.random() * 9000);
    const mailOptions = {
      from: "quickstopshop360@gmail.com",
      to: req.body.email,
      subject: "Account verification",
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
      userId: newUser._id,
    });
    await emailCode.save();
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message);
        return res
          .status(400)
          .json({ status: 400, message: "Request not completed" });
      }
      return res.status(200).json({
        status: 200,
        message: "successful registration",
        _id: newUser._id,
      });
    });
  }
);

router.post(
  "/login",
  userValidationRules(),
  validate,
  async (req, res, next) => {
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
        return res
          .status(200)
          .json({ status: 200, message: "Login was successful" });
      });
    })(req, res, next);
  }
);

router.post(
  "/verify_code",
  checkCodeRules(),
  codeValidate,
  async (req, res) => {
    try {
      const { code, userId } = req.body;
      console.log(userId);
      let clientErrors = [];
      const getUser = await User.findById(userId);
      if (getUser) {
        const tokenRecord = await Code.findOne({ token: code });
        if (tokenRecord) {
          const diff = Math.abs(new Date() - new Date(tokenRecord.createdAt));
          const minutes = Math.floor(diff / 1000 / 60);
          if (Math.floor(minutes) >= 15) {
            //const removedToken = tokenRecord.remove();
            await Code.deleteMany({ userId });
            clientErrors.push({
              msg: "Code is expired, please request new code",
            });
            return res.status(400).json({ clientErrors });
          }
          const updateUser = await User.updateOne(
            { _id: userId },
            { $set: { isConfirmed: 1 } }
          );
          //const removedToken = tokenRecord.remove();
          await Code.deleteMany({ userId });
          return res.status(200).json({
            _id: getUser._id,
            status: 200,
            message: "Verified successfully",
          });
        }
        clientErrors.push({ msg: "Code does not exist, please request new" });
        return res.status(400).send({ clientErrors });
      }
      clientErrors.push({ msg: "Unauthorized request, user not found" });
      return res.status(401).send({ clientErrors });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({ error: error.message });
    }
  }
);

//request code
router.post("/request_code", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const newUser = await User.findById(userId);
    if (newUser) {
      if (newUser.isConfirmed == 1) {
        return res.status(400).send({
          message: "Account already Confirmed, please login to continue",
        });
      }
      const tokenVal = Math.floor(1000 + Math.random() * 9000);
      const mailOptions = {
        from: "quickstopshop360@gmail.com",
        to: newUser.email,
        subject: "Account verification",
        text:
          "Hello! " +
          newUser.lastname +
          "\n" +
          "welcome to Stopshop360 \n" +
          " your Verification code is:" +
          tokenVal,
      };
      const emailCode = await new Code({
        token: tokenVal,
        email: newUser.email,
        userId,
      });
      await emailCode.save();
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error.message);
          return res
            .status(400)
            .json({ status: 400, message: "Request not completed" });
        }
        return res.status(200).json({
          status: 200,
          message: `New Code has been resent to ${newUser.email}, expires in 15mins`,
          _id: newUser._id,
        });
      });
    } else {
      return res.status(401).json({
        message: "Unauthorized request, please register and continue",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/logout", async (req, res, next) => {
  //await User.updateOne({_id:req.user._id},{$set :{connected : false}})
  console.log(req.user._id);
  req.session.destroy(function () {
    return res
      .status(200)
      .send({ status: 200, message: "Operation was successful" });
  });
});

module.exports = router;
