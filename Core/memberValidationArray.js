const { body } = require("express-validator");
exports.validatePostArray = [
  body("_id").isInt().withMessage("member id should be integer"),
  body("fullName")
    .isString()
    .withMessage("member fullname should be string")
    .isLength({ min: 6})
    .withMessage("member fullname should contain at least 6 chars"),
  body("email").isEmail().withMessage("invalid mail"),
  body("password")
    .isStrongPassword()
    .withMessage(
      "password should contains at least 8 characters, one uppercase letter, one lowercase letter,one special char, and one number"
    ),
  body("phoneNumber")
  .isString()
  .withMessage("invalid phoneNumber")
  .isLength({ min: 11,max:11})
  .withMessage("phoneNumber should contain 11 chars"),
  body("birthdate").isDate().withMessage("invalid birth date"),
  body("fullAddress").isObject().withMessage("Address must be an Object"),
  body("address.city").isString().withMessage("member Address City must be a String"),
  body("address.street").isString().withMessage("member Address Street must be a String"),
  body("address.building").isInt().withMessage("member Address Building must be an Integer"),
  body("createdAt").isDate().withMessage("invalid creating date"),
];
exports.validatePatchArray = [
    body("fullName")
      .optional()
      .isString()
      .withMessage("member fullname should be string")
      .isLength({ min: 6})
      .withMessage("member fullname should contain at least 6 chars"),
    body("email").optional().isEmail().withMessage("invalid mail"),
    body("password")
      .optional()
      .isStrongPassword()
      .withMessage(
        "password should contains at least 8 characters, one uppercase letter, one lowercase letter,one special char, and one number"
      ),
    body("phoneNumber")
      .optional()
      .isString()
      .withMessage("invalid phoneNumber")
      .isLength({ min: 11,max:11})
      .withMessage("phoneNumber should contain 11 chars"),
    body("birthdate").optional().isDate().withMessage("invalid birth date"),
    body("fullAddress").optional().isObject().withMessage("Address must be an Object"),
    body("address.city").optional().isString().withMessage("member Address City must be a String"),
    body("address.street").optional().isString().withMessage("member Address Street must be a String"),
    body("address.building").optional().isInt().withMessage("member Address Building must be an Integer"),
    body("createdAt").optional().isDate().withMessage("invalid creating date"),

];
