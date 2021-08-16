const { body, validationResult } = require("express-validator");
const Category = require("./../server/models/categoryModel");

const userValidationRules = () => {
  return [
    body("email").isEmail().escape().withMessage("Please provide valid email"),
    body("password", "Password is required")
      .notEmpty()
      .escape()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 chars long"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({msg: err.msg }));
  console.log(extractedErrors);
  return res.status(400).json({
    extractedErrors
  });
};

const userRegValidationRules = () => {
  return [
    body("email").isEmail().withMessage('Please provide a valid email'),
    // .custom( async (email) => {
    //   return User.findOne({email}).then(user => {
    //     if (user) {
    //       return Promise.reject('E-mail already in use');
    //     }
    //   });
    // }).withMessage("Email already taken"),
    body("firstname", "first name is required")
      .notEmpty()
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 chars long"),
      body("lastname", "Last name is required")
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 chars long"),
    body("phone", "Phone number is required")
      .notEmpty()
      .escape()
      //.isNumeric()
      .isLength({ min: 11 })
      .withMessage("Phone no must be a number between 0-9"),
    body("password", "password is required")
      .notEmpty()
      .escape()
      .isLength({ min: 5 })
      .withMessage("Password must be atleast 5 chars long")
      .custom((value, {req }) => {
        if (value === req.body.confirmPassword) {
          return true;
        } else {
          return false;
        }
      })
      .withMessage("Passwords don't match."),
  ];
};

const regValidate = (req, res, next) => {
  const errors = validationResult(req);
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({msg: err.msg }))
  if (extractedErrors.length==0) {
    return next();
  }
  console.log(extractedErrors);
  return res.status(400).send({
    extractedErrors
  });
};

const checkCodeRules = () => {
  return [
    body("code")
      .trim()
      .escape()
      .isNumeric()
      .withMessage("Code must be 4 digits")
      .notEmpty()
      .withMessage("Please provide a valid code"),
  ];
};

const codeValidate = (req, res, next) => {
  const errors = validationResult(req);
  const clientErrors = [];
  errors.array().map((err) => clientErrors.push({ msg: err.msg }));
  if (clientErrors.length == 0) {
    return next();
  }
  console.log(clientErrors);
  return res.status(400).send({
    clientErrors,
  });
};


const productCreationRules = () => {
  return [
    body("category", "Category is required")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Category is required"),
    body("location", "Location is required")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Location is required"),
    body("title", "Title is required")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Title is required"),
    body("type", "Sub category is required")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Sub category is required"),
    body("condition", "Condition is required")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Condition is required"),
    body("description", "Product Description is required")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Product Description is required"),
    body("price", "Product Price is required")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Product Price is required"),
    body("phone", "Phone number is required")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Phone is required"),
    body("name", "Product name is required")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Product name is required")
  ];
};

const productValidate = (req, res, next) => {
  const errors = validationResult(req);
  const clientErrors = [];
  errors.array().map((err) => clientErrors.push({ msg: err.msg }));
  if (clientErrors.length == 0) {
    return next();
  }
  console.log(clientErrors);
  return res.status(400).send({
    clientErrors,
  });
};


const categoryRules = () => {
  return [
    body("category")
        .custom(category => {
         return Category.findOne({category}).then(record => {
        if (record) {
          return Promise.reject('Category already created');
        }
      });
    })
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Category field is required")
  ];
};

const categoryValidate = (req, res, next) => {
  const errors = validationResult(req);
  const clientErrors = [];
  errors.array().map((err) => clientErrors.push({ msg: err.msg }));
  if (clientErrors.length == 0) {
    return next();
  }
  console.log(clientErrors);
  return res.status(400).send({
    clientErrors,
  });
};

const subCategoryRules = () => {
  return [
    body("category")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Category field is required"),
    body("sub_category")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Sub category field is required"),
  ];
};

const subCategoryValidate = (req, res, next) => {
  const errors = validationResult(req);
  const clientErrors = [];
  errors.array().map((err) => clientErrors.push({ msg: err.msg }));
  if (clientErrors.length == 0) {
    return next();
  }
  console.log(clientErrors);
  return res.status(400).send({
    clientErrors,
  });
};

const productSearchRules = () => {
  return [
    body("name")
      .trim()
      .escape()
      // .notEmpty()
      .isLength({ max: 30 })
      .withMessage("Search field is required"),
  ];
};

const productSearchValidate = (req, res, next) => {
  const errors = validationResult(req);
  const clientErrors = [];
  errors.array().map((err) => clientErrors.push({ msg: err.msg }));
  if (clientErrors.length == 0) {
    return next();
  }
  console.log(clientErrors);
  return res.status(400).send({
    clientErrors,
  });
};

module.exports = {
  userValidationRules,
  validate,
  userRegValidationRules,
  regValidate,
  checkCodeRules,
  codeValidate,
  productCreationRules,
  productValidate,
  categoryRules,
  categoryValidate,
  subCategoryRules,
  subCategoryValidate,
  productSearchRules,
  productSearchValidate

};
