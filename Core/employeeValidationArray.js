const { body } = require("express-validator");
exports.validatePostArray = [
  body("_id")
    .optional()
    .isInt()
    .withMessage("Employee id should be an integer"),
  body("fname")
    .isString()
    .withMessage("Employee first name should be string")
    .isLength({ min: 2 })
    .withMessage("Employee first name should contain at least 2 chars"),
  body("lname")
    .isString()
    .withMessage("Employee last name should be string")
    .isLength({ min: 2 })
    .withMessage("Employee last name should contain at least 2 chars"),
  body("email").isEmail().withMessage("invalid mail"),
  body("password")
    .optional()
    .isStrongPassword()
    .withMessage(
      "password should contains at least 8 characters, one uppercase letter, one lowercase letter,one special char, and one number"
    ),
  body("salary").isNumeric().withMessage("salary should be numeric value"),
  body("birthdate").isDate().withMessage("invalid birth date"),
  body("hiredate").isDate().withMessage("invalid hire date"),
];
exports.validatePatchArray = [
  body("fname")
    .optional()
    .isString()
    .withMessage("Employee first name should be string")
    .isLength({ min: 2 })
    .withMessage("Employee first name should contain at least 2 chars"),
  body("lname")
    .optional()
    .isString()
    .withMessage("Employee last name should be string")
    .isLength({ min: 2 })
    .withMessage("Employee last name should contain at least 2 chars"),
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
exports.validateDelArray = [
  body("_id").isInt().withMessage("Employee id should be an integer"),
];
