const express = require("express");
const router = express.Router();
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const multer = require("multer");
const sharp = require('sharp');
const Product = require("../models/productsModel");
const Category = require("../models/categoryModel");
const Booking = require("../models/bookingModel");
const Banner = require("../models/bannerModel");

const {
  productCreationRules,
  productValidate,
  productSearchRules,
  productSearchValidate,
  bannerCreationRules,
  bannerValidate
} = require("../../middleware/validator");

const {
  ensureAuthenticated,
  alreadyAuthenticated,
  isAdmin,
} = require("../../middleware/auth");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wizzyjazzpa4blinks@gmail.com",
    pass: "Wizzyjazzpa@1",
  },
});

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

router.get("/product_search", [productSearchRules(), productSearchValidate], async(req, res)=> {
  const nameVal = req.query.name ;
  const nameFilter = nameVal ? { "name": {$regex: nameVal, $options: "i"}} : {};
  const titleFilter = nameVal ? { "title": {$regex: nameVal, $options: "i"} } : {};
  const categoryFilter = nameVal ? { "category": {$regex: nameVal, $options: "i"}} : {};
  const products = await Product.find()
  .or([{...nameFilter}, {...titleFilter}, {...categoryFilter}])
  .sort({name: 1})
  .select({name: 1, _id: 1, category: 1 })
  res.status(200).send({status:200, products });
});

//category for ui
router.get("/categories/ui", async (req, res) => {
  const categories = await Category.find();
  res.send({ status: 200, categories: categories });
});

router.get("/:category/subcategories", async (req, res) => {
  const category = req.params.category;
  const fetchCategory = await Category.findOne({ category });
  if (fetchCategory) {
    return res
      .status(200)
      .send({ status: 200, subCategories: fetchCategory.subCategory });
  }
  return res.status(400).send({ message: "Category not found" });
});

router.post("/request_booking", async (req, res) => {
  try {
    const { getdate, getyear, from_time, to_time, productId } = req.body;
    if (!req.user) {
      return res.status(400).send({
        status: 400,
        message: "Please login to complete this booking operation",
      });
    }
    if (!getdate || !getyear || !from_time || !to_time) {
      return res
        .status(400)
        .send({ status: 400, message: "Please provide complete booking data" });
    }
    
    const product = await Product.findById(productId)
      .select({ name: 1, location: 1, price: 1, seller: 1 })
      .populate("seller", "email firstname phone _id ");
      
    if (req.user._id.toString()  === product.seller._id.toString()) {
      return res
        .status(400)
        .send({ status: 400, message: "You cannot book your own service" });
    }

    const cleanYear = getyear.replace(/\s+/g, '');
    const booking = new Booking({
      date: getdate+"-"+cleanYear,
      from_time: from_time,
      to_time,
      requester: req.user._id,
      service_provider: product.seller.id,
    });
    const newBooking = await booking.save();
    const mailOptions = {
      from: "wizzyjazzpa4blinks@gmail.com",
      to: product.seller.email,
      subject: "New Booking Request",
      html:
        "Hello! " +
        product.seller.firstname +
        "\n" +
        `<div>
               <b>${
                 req.user.firstname
               }</b> just made request for a booking service <br>
                <h4><u>Booking details as follows:</u></h4>
                 <p>Service Name: ${product.name} </p>
                 <p>Booked from: ${from_time}</p>
                 <p>Booked To: ${to_time}</p> 
                 <p>Booked Date: ${getdate}-${cleanYear}</p>
            </div>
          `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message);
        return res
          .status(400)
          .json({ status: 400, message: "Request not completed" });
      }
      return res.status(200).json({
        status: 200,
        message: "Booking request was sent successfully",
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

router.post(
  "/upload_product",
  [
    imageUpload.array("images", 5),
    productCreationRules(),
    productValidate,
    ensureAuthenticated,
  ],
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
    return res.status(200).send({
      status: 200,
      message: "Product was created successfully",
      product: createdProduct,
    });
  },
  (error, req, res, next) => {
    return res.status(400).send({ error: error.message });
  }
);


router.post("/upload_banner", [imageUpload.single("bannerImage"), bannerCreationRules(), bannerValidate, ensureAuthenticated, isAdmin], async (req, res) => {       
    if (!req.file) {
      return res.status(400).send({ error: "No file selected" });
    }
    const { filename: bannerImage } = req.file;
    await sharp(req.file.path)
     .resize(200, 200)
     .jpeg({ quality: 90 })
     .toFile(
         path.resolve(req.file.destination, 'resized', bannerImage)
     )
     fs.unlinkSync(req.file.path)
    
    const {image_title, top_title, ad_description, adPricing } = req.body;

    const banner = await new Banner({
      image_title,
      top_title,
      description:ad_description,
      pricing: parseInt(adPricing),
    });
    const createdBanner = await banner.save();
    return res.status(200).send({
      status: 200,
      message: "Banner was created successfully",
      banner: createdBanner,
    });
  },
  (error, req, res, next) => {
    return res.status(400).send({ error: error.message });
  }
);

module.exports = router;
