const express = require("express");
const { validatePostArray, validatePatchArray } = require("./../Core/");
const validateMW = require("./../Core/validations/validateMW");
const controller = require("./../Controller/bookController");
const {
  checkBadminOrAdminOrEmployeeBook,
} = require("./../Core/auth/authenticationMW");
// Upload Image
const uploadImage = require("../helpers/uploadingImages");
const upload = uploadImage("Books");
const router = express.Router();

router
  .route("/book/borrow")
  .get(checkBadminOrAdminOrEmployeeBook, controller.borrowBooks);
module.exports = router;
