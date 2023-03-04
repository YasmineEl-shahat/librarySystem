const { body } = require("express-validator");
exports.validatePostArray = [
  body("_id").isInt().withMessage("book id should be integer"),
  body("title") .isString().withMessage("book title should be string"),
  body("auther")
    .isString()
    .withMessage("book auther name should be string")
    .isLength({ min: 2 })
    .withMessage("book auther name  should contain at least 2 chars"),
  body("publisher")
   .isString()
   .withMessage("book publisher name should be string")
   .isLength({ min: 2 })
   .withMessage("book publisher name should contain at least 2 chars"),
  body("publishingDate").isDate().withMessage("book Publishing Date should be date"),
  body("category")
  .isString()
  .withMessage("book category should be string")
  .isLength({ min: 2 })
  .withMessage("book category should contain at least 2 chars"),
  body("edition").isInt().withMessage("book edition should be integer"),
  body("pages").isInt().withMessage("book pages should be integer"),
  body("avilable").isInt().withMessage(" avilable books number should be integer"),
  body("shelfNo").isInt().withMessage("book shelfNo should be integer"),
];
exports.validatePatchArray = [
    body("title").optional().isString().withMessage("book title should be string"),
    body("auther")
      .optional()
      .isString()
      .withMessage("book auther name should be string")
      .isLength({ min: 2 })
      .withMessage("book auther name  should contain at least 2 chars"),
    body("publisher")
      .optional()
      .isString()
      .withMessage("book publisher name should be string")
      .isLength({ min: 2 })
      .withMessage("book publisher name should contain at least 2 chars"),
    body("publishingDate").optional().isDate().withMessage("book Publishing Date should be date"),
    body("category")
      .optional()
      .isString()
      .withMessage("book category should be string")
      .isLength({ min: 2 })
      .withMessage("book category should contain at least 2 chars"),
    body("edition").optional().isInt().withMessage("book edition should be integer"),
    body("pages").optional().isInt().withMessage("book pages should be integer"),
    body("avilable").optional().isInt().withMessage(" avilable books number should be integer"),
    body("shelfNo").optional().isInt().withMessage("book shelfNo should be integer"),
 
];
