const express = require("express");
const {
  validatePostArray,
  validatePatchArray,
} = require("./../Core/bookValidationArray");
const validateMW = require("./../Core/validations/validateMW");
const controller = require("./../Controller/bookController");
const {
  checkBadminOrAdminOrEmployee,
  checkGeneralAuthentication,
} = require("./../Core/auth/authenticationMW");
// Upload Image
const uploadImage = require("../helpers/uploadingImages");
const upload = uploadImage("Books");

const router = express.Router();
router
  .route("/books")
  .get(checkGeneralAuthentication, controller.getAllBooks)
  .post(
    upload.single("image"),
    checkBadminOrAdminOrEmployee,
    validatePostArray,
    validateMW,
    controller.addBook
  )
  .patch(
    upload.single("image"),
    checkBadminOrAdminOrEmployee,
    validatePatchArray,
    validateMW,
    controller.updateBook
  );

router
  .route("/books/:id")
  .get(checkBadminOrAdminOrEmployee, controller.getBook)
  .delete(checkBadminOrAdminOrEmployee, controller.deleteBook);
  
router
  .route("/newBooks")
  .get(checkGeneralAuthentication, controller.getNewBooks);

router
  .route("/booksYear")
  .get(checkGeneralAuthentication, controller.getBooksYear);

router
  .route("/searchBook/:title?/:publisher?/:auther?")
  .get(checkBadminOrAdminOrEmployee, controller.bookSearch);

router
  .route("/AvailableBooks")
  .get(checkGeneralAuthentication, controller.availableBook);

router
  .route("/bookSearchFilter")
  .get(checkGeneralAuthentication, controller.bookSearchFilter);

module.exports = router;
