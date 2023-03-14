const express = require("express");
// const { validatePostArray, validatePatchArray } = require("./../Core/");
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

// router
//   .route("/book/borrow")
//   .get(checkBadminOrAdminOrEmployeeBook, controller.borrowBooks);
router
  .route("/borrowedBooks/list/:year?/:month?")
  .get(
    checkBadminOrAdminOrEmployeeBook,
    bookOperationController.borrowBooksList
  );

router
  .route("/book/read")
  .post(checkBadminOrAdminOrEmployeeBook, bookOperationController.readBook);
module.exports = router;
