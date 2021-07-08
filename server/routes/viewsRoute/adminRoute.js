const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  alreadyAuthenticated,
} = require("../../../middleware/auth");

router.get("/admin/login", (req, res) => {
  console.log("Request for admin index received");
  res.render("admin/index");
});

router.get("/admin/register", (req, res) => {
  console.log("Request for admin register received" + req);
  res.render("admin/register");
});

router.get("/admin/dashboard", (req, res) => {
  console.log("Request for admin register received");
  res.render("admin/dashboard");
});

module.exports = router;
