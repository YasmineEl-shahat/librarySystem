const { body } = require("express-validator");
exports.validatePostArray = [
  body("bookId").isInt().withMessage("Invalid Book ID"),
  body("memberId").isInt().withMessage("Invalid Book ID"),
  body("employeeId").isInt().withMessage("Invalid Book ID"),
  body("deadlineDate").isDate().withMessage("Invalid DeadLine Data"),
  body("returnDate").isDate().withMessage("Invalid Return Data"),
  body("return").isBoolean().withMessage("Value MustBe true or false"),
];
