const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");

const {
  categoryRules,
  categoryValidate,
  subCategoryRules,
  subCategoryValidate,
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
      if (newCategory) {
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

router.post(
  "/sub_categories",
  [subCategoryRules(), subCategoryValidate],
  async (req, res, next) => {
    try {
      let clientErrors = [];
      const { category: categoryValue, sub_category } = req.body;
      const category = await Category.findOne({ category: categoryValue });
      if (category) {
        if (category.subCategory.find((x) => x.name === sub_category)) {
          clientErrors.push({
            msg: "Sub category has already been created for the selected category",
          });
          return res.status(400).send({ clientErrors });
        }
        const subCat = {
          name: sub_category,
        };
        category.subCategory.push(subCat);
        const updatedCategory = await category.save();
        res.status(200).send({
          status:200,
          message: "Sub category created successfully",
          name: updatedCategory.subCategory[
            updatedCategory.subCategory.length - 1
          ],
        });
      } else {
        clientErrors.push({ msg: "Category not found" });
        return res.status(400).send({ clientErrors });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
