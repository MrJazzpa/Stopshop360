const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");

const {
  categoryRules,
  categoryValidate,
} = require("../../middleware/validator");

const {
  ensureAuthenticated,
  alreadyAuthenticated,
} = require("../../middleware/auth");

router.post(
  "/create_category",
  [categoryRules(), categoryValidate],
  async (req, res, next) => {
    try {
      let clientErrors = [];
      const { category } = req.body;
      const categoryInfo = new Category({
        category,
      });
      const newCategory = await categoryInfo.save();
      if(newCategory){
        return res.status(200).send({
          status: 200,
          message: "Category was created successfully",
          category: newCategory._id,
        });
      }
      clientErrors.push({ msg: "fatal error occurred" });
      return res.status(400).send({ clientErrors });

    } catch (error) {
      console.log(error.message);
      return res.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
