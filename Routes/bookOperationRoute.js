const express = require("express");
const { validateBookOperation } = require("./../Core/bookValidationArray");
const validateMW = require("./../Core/validations/validateMW");
const controller = require("./../Controller/bookController");
const bookOperationController = require("./../Controller/bookOperationController");
const {
  checkBadminOrAdminOrEmployeeBook,
  checkBaseAdminOremployee,
} = require("./../Core/auth/authenticationMW");
// Upload Image
const uploadImage = require("../helpers/uploadingImages");
const upload = uploadImage("Books");
const router = express.Router();

router
  .route("/borrowedBooks")
  .get(
    checkBadminOrAdminOrEmployeeBook,
    bookOperationController.getAllBookOperation
  );

router
  .route("/book/borrowed")
  .get(
    checkBadminOrAdminOrEmployeeBook,
    bookOperationController.getBorrowedBook
  );
  router
  .route("/book/reading")
  .get(
    checkBadminOrAdminOrEmployeeBook,
    bookOperationController.getReadingBook
  );
router
  .route("/borrowedBooks/list/:year?/:month?")
  .get(
    checkBadminOrAdminOrEmployeeBook,
    bookOperationController.borrowBooksList
  );

router
  .route("/book/read")
  .post(checkBadminOrAdminOrEmployeeBook, bookOperationController.readBook);

router
  .route("/book/borrow")
  .post(
    checkBadminOrAdminOrEmployeeBook,
    validateBookOperation,
    validateMW,
    bookOperationController.borrowBooks
  );
module.exports = router;
