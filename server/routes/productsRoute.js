const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Product = require("../models/productsModel");
const Category = require("../models/categoryModel");


const {
  productCreationRules,
  productValidate,
} = require("../../middleware/validator");

const {
  ensureAuthenticated,
  alreadyAuthenticated,
} = require("../../middleware/auth");

const imageStorage = multer.diskStorage({
  destination: "uploads/",
  filename(req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    files: 5,
    fileSize: 1000000, //1000000 for 1mb sizes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("File format must be any of png, jpg or jpeg"));
    }
    cb(undefined, true);
  },
});

router.get("/categories", async (req, res) => {
  const categories = await Category.find().distinct("category");
  res.send({ status: 200, categories: categories });
});

//category for ui
router.get("/categories/ui", async (req, res) => {
  const categories = await Category.find();
  res.send({ status: 200, categories: categories });
});

router.get("/:category/subcategories", async (req, res) => {
  const category = req.params.category;
  const fetchCategory = await Category.findOne({category});
  if(fetchCategory){
    return res
    .status(200)
    .send({status:200, subCategories: fetchCategory.subCategory});
  }
  return res.status(400).send({message: "Category not found"});
});

router.get("/", async (req, res) => {

});

router.post(
  "/upload_product",
  [imageUpload.array("images", 5), productCreationRules(), productValidate, ensureAuthenticated],
  async (req, res) => {
    if (req.files.length === 0) {
      return res.status(400).send({ error: "No file selected" });
    }
    //res.send(req.files)
    const images = [];
    req.files.map((items) => images.push(items.path));
    const {
      category,
      location,
      title,
      type,
      condition,
      description,
      price,
      phone,
      name,
    } = req.body;
    const product = await new Product({
      name,
      seller: req.user._id,
      location,
      image: images,
      category,
      price: parseInt(price),
      title,
      phone,
      type,
      condition,
      description,
    });
    const createdProduct = await product.save();
    return res
      .status(200)
      .send({
        status: 200,
        message: "Product was created successfully",
        product: createdProduct,
      });
  },
  (error, req, res, next) => {
    return res.status(400).send({ error: error.message });
  }
);

module.exports = router;
