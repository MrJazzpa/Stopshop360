const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");
const { userRegValidationRules, regValidate} = require('../../middleware/validator');

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wizzyjazzpa4blinks@gmail.com",
    pass: "Wizzyjazzpa@1",
  },
});

router.post("/register", userRegValidationRules(), regValidate, async (req, res) => {
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
    verification_code: verify_code,
  });
  register
    .save(register)
    .then((data) => {
      console.log(data);
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error.message);
          return res.status(400).json({ status: 400, message: "Request not completed" });
        } 
         return res.status(200).json({ status: 200, message: "success" });
      });
    })
    .catch((err) => {
      res.json({ status: 500, message: err.message });
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

router.post("/email_verification", async (req, res) => {
  const verify_code = req.query.verification_code;
  shop360
    .findOne({ verification_code: verify_code })
    .then((data) => {
      if (!data) {
        res.json({ status: 400, message: "not fund" });
      } else {
        res.json({
          Email: data.email,
          verification_code: data.verification_code,
          status: 200,
        });
      }
      //res.redirect('/dashboard');
    })
    .catch((err) => {
      res.status(500).send({ message: "error retrieving user" });
    });
});

module.exports = router;
