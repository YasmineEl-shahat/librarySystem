const { body } = require("express-validator");
exports.validatePostArray = [
  body("id").optional().isInt().withMessage("member id should be integer"),
  body("name")
    .isString()
    .withMessage("member fullname should be string")
    .isLength({ min: 6 })
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
    .isLength({ min: 11, max: 11 })
    .withMessage("phoneNumber should contain 11 chars"),
  body("birthdate").isDate().withMessage("invalid birth date"),
  // body("fullAddress").isObject().withMessage("Address must be an Object"),
  body("city").isString().withMessage("member Address City must be a String"),
  body("street")
    .isString()
    .withMessage("member Address Street must be a String"),
  body("building")
    .isInt()
    .withMessage("member Address Building must be an Integer"),
  body("readingBooks")
    .optional()
    .isArray()
    .withMessage("Invalid Reading Books Array"),
  body("readingBooks.bookId").optional().isInt().withMessage("Invalid Book ID"),
  body("readingBooks.date")
    .optional()
    .isDate()
    .withMessage("Invalid Reading Data"),
  body("readingBooks.nor")
    .optional()
    .isInt()
    .withMessage("Invalid NO of Readings"),
  body("borrowedBooks")
    .optional()
    .isArray()
    .withMessage("Invalid Borrowed Books Array"),
  body("borrowedBooks.bookId")
    .optional()
    .isInt()
    .withMessage("Invalid Book ID"),
  body("borrowedBooks.deadlineDate")
    .optional()
    .isDate()
    .withMessage("Invalid DeadLine Data"),
  body("borrowedBooks.nop")
    .optional()
    .isInt()
    .withMessage("Invalid NO of Borrowed"),
  body("borrowedBooks.return")
    .optional()
    .isBoolean()
    .withMessage("Value MustBe true or false"),
];

exports.validatePatchArray = [
  body("fullName")
    .optional()
    .isString()
    .withMessage("member fullname should be string")
    .isLength({ min: 6 })
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
    .isLength({ min: 11, max: 11 })
    .withMessage("phoneNumber should contain 11 chars"),
  body("birthdate").optional().isDate().withMessage("invalid birth date"),
  // body("fullAddress").optional().isObject().withMessage("Address must be an Object"),
  body("city")
    .optional()
    .isString()
    .withMessage("member Address City must be a String"),
  body("street")
    .optional()
    .isString()
    .withMessage("member Address Street must be a String"),
  body("building")
    .optional()
    .isInt()
    .withMessage("member Address Building must be an Integer"),
];
