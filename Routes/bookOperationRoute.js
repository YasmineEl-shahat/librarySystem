const express = require("express");
const { validateBookOperation } = require("./../Core/bookValidationArray");
const validateMW = require("./../Core/validations/validateMW");
const controller = require("./../Controller/bookController");
const bookOperationController = require("./../Controller/bookOperationController");
const {
  checkBadminOrAdminOrEmployeeBook,
  checkBaseAdminOremployee,
  checkGeneralAuthentication
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
    checkGeneralAuthentication,
    bookOperationController.getBorrowedBook
  );
  router
  .route("/book/mostBorrowed")
  .get(
    checkGeneralAuthentication,
    bookOperationController.mostBorrowedBook
  );
router
  .route("/book/reading")
  .get(
    checkGeneralAuthentication,
    bookOperationController.getReadingBook
  );
router
  .route("/borrowedBooks/list")
  .get(
    checkGeneralAuthentication,
    bookOperationController.borrowBooksList
  );
  router
  .route("/readingBooks/list")
  .get(
    checkGeneralAuthentication,
    bookOperationController.readBooksList
  );
router
  .route("/book/read")
  .post(checkBadminOrAdminOrEmployeeBook, bookOperationController.readBook);

router
  .route("/book/return")
  .post(checkBadminOrAdminOrEmployeeBook, bookOperationController.returnBook);


router
  .route("/book/borrow")
  .post(
    checkBadminOrAdminOrEmployeeBook,
    validateBookOperation,
    validateMW,
    bookOperationController.borrowBooks
  );
  
router
.route("/borrowedBooks/current")
.get(
  bookOperationController.currentBorrowedBooks
);

module.exports = router;


