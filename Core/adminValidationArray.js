const { body } = require("express-validator");
exports.validatePostArray = [
  body("_id").optional().isInt().withMessage("admin id should be integer"),
  body("fname")
    .isString()
    .withMessage("admin first name should be string")
    .isLength({ min: 2 })
    .withMessage("admin first name should contain at least 2 chars"),
  body("lname")
    .isString()
    .withMessage("admin last name should be string")
    .isLength({ min: 2 })
    .withMessage("admin last name should contain at least 2 chars"),
  body("email").isEmail().withMessage("invalid mail"),
  body("isBase")
    .isBoolean()
    .withMessage(
      "isBase should be boolean value, true for basic admin, false for admins"
    ),
  body("password")
    .isStrongPassword()
    .withMessage(
      "password should contains at least 8 characters, one uppercase letter, one lowercase letter,one special char, and one number"
    )
    .default("newAd12_"),
  body("salary").isNumeric().withMessage("salary should be numeric value"),
  body("birthdate").isDate().withMessage("invalid birth date"),
  body("hiredate").isDate().withMessage("invalid hire date"),
];
exports.validatePatchArray = [
  body("fname")
    .optional()
    .isString()
    .withMessage("admin first name should be string")
    .isLength({ min: 2 })
    .withMessage("admin first name should contain at least 2 chars"),
  body("lname")
    .optional()
    .isString()
    .withMessage("admin last name should be string")
    .isLength({ min: 2 })
    .withMessage("admin last name should contain at least 2 chars"),
  body("email").optional().isEmail().withMessage("invalid mail"),
  body("password")
    .optional()
    .isStrongPassword()
    .withMessage(
      "password should contains at least 8 characters, one uppercase letter, one lowercase letter,one special char, and one number"
    ),
  body("salary")
    .optional()
    .isNumeric()
    .withMessage("salary should be numeric value"),
  body("birthdate").optional().isDate().withMessage("invalid birth date"),
  body("hiredate").optional().isDate().withMessage("invalid hire date"),
];
