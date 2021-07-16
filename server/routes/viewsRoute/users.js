const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  alreadyAuthenticated,
} = require("../../../middleware/auth");

router.get("/", (req, res) => {
  console.log("Request for home recieved");
  res.render("index");
});

router.get("/forgot_password", alreadyAuthenticated, (req, res) => {
  res.render("users/forgot_email");
});

router.get("/verify_code", alreadyAuthenticated, (req, res) => {
  res.render("users/verify_code");
});

router.get("/contact",  (req, res) => {
  console.log("Request for contact page recieved");
  res.render("contact");
});

router.get("/change_password", alreadyAuthenticated, (req, res) => {
  res.render("change_password");
});

router.get("/products", (req, res) => {
  res.render("users/product");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("users/dashboard");
});

module.exports = router;
