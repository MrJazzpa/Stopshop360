const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");
const Product = require("../models/productsModel");


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

router.post("/update_single", async(req, res) =>{
   const { checkItem, itemId, priority } = req.body;
   const existingProduct = await Product.findById(itemId);
   if(existingProduct.priority == priority && existingProduct.isConfirmed==checkItem){
    return res.status(400).json({
      status: 400,
      message: "Nothing was updated!",
    });
    }
     const updatedItem = await Product.updateOne(
      { _id: itemId },
      { $set: { isConfirmed: checkItem === 0 ? existingProduct.isConfirmed : checkItem, priority } }
    );
    console.log(updatedItem);
    if(updatedItem){
      return res.status(200).json({
        _id: updatedItem._id,
        status: 200,
        message: "Item has been Updated successfully!",
      });
    }
});
module.exports = router;
