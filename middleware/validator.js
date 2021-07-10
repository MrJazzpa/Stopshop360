const { body, validationResult } = require("express-validator");
const User = require("./../server/models/userModel");

const userValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Must be a valid email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  console.log(extractedErrors);
  return res.status(400).json({
    errors: extractedErrors,
  });
};

const userRegValidationRules = () => {
  return [
    body("email").isEmail().withMessage('Please provide a valid email')
    .custom( async (email) => {
      return User.findOne({email}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }).withMessage("already taken"),
    body("firstname", "first name is required")
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 chars long"),
      body("lastname", "Last name is required")
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 chars long"),
    body("phone", "Phone number is required")
      .notEmpty()
      //.isNumeric()
      .isLength({ min: 11 })
      .withMessage("Phone no must be a number between 0-9"),
    body("password", "password is required")
      .notEmpty()
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

module.exports = {
  userValidationRules,
  validate,
  userRegValidationRules,
  regValidate,
};
