const express = require("express");
const router = express.Router();
const Product = require("../../models/productsModel");

const {
  ensureAuthenticated,
  alreadyAuthenticated,
} = require("../../../middleware/auth");

router.get("/details",  async(req, res) => {
  if(!req.query.product){
    return res.render("index")
  }
  return res.render("users/product-sticky");
});

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



router.get("/products", async(req, res) => {
  const category = req.query.category;
  const subCategory = req.query.subcategory;
  const categoryFilter = category ? { category: {$regex: category, $options: "i"} } : {};
  const subCategoryFilter = subCategory ? { type: { $regex: subCategory, $options: "i" } } : {};

  const productsData = await Product.find({
    ...categoryFilter,
    ...subCategoryFilter
  }).sort({_id: -1});
  //console.log(productsData);
  res.render("users/products", {productsData, category, subCategory});
});


router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("users/dashboard");
});

module.exports = router;
