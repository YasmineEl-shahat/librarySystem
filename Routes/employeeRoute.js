const express = require("express");
const controller = require("./../Controller/employeeController");
const searchController = require("./../Controller/searchController");
const {
  checkAdminOrBadmin,
  checkBadminOrAdminOrEmployee,
  employeeOrAdmin,
} = require("./../Core/auth/authenticationMW");
const validateMW = require("./../Core/validations/validateMW");
const {
  validateDelArray,
  validatePatchArray,
  validatePostArray,
} = require("./../Core/employeeValidationArray");
const uploadImage = require("../helpers/uploadingImages");
const intParam = require("../Core/paramValidation").intParam;
// upload image
const upload = uploadImage("employee");

const router = express.Router();

router
  .route("/employee")
  .get(checkBadminOrAdminOrEmployee, controller.getAllEmployee)
  .post(
    upload.single("image"),
    checkAdminOrBadmin,
    validatePostArray,
    validateMW,
    controller.addEmployee
  );

router
  .route("/employee/:id")
  .get(
    intParam,
    validateMW,
    checkBadminOrAdminOrEmployee,
    controller.getEmployee
  )
  .patch(
    upload.single("image"),
    intParam,
    validatePatchArray,
    validateMW,
    checkBadminOrAdminOrEmployee,
    validatePatchArray,
    validateMW,
    controller.updateEmployee
  )
  .delete(
    checkAdminOrBadmin,
    validateDelArray,
    validateMW,
    controller.deleteEmployee
  );

// router.get("/employee")
///////////////////////search/////////////////////////////////
router.get("/searchName/:name", searchController.getMemberByName);
router.get("/searchEmail/:email", searchController.getMemberByEmail);
router.get("/bookAuther/:auther", searchController.bookAuther);
router.get("/bookPuplisher/:puplisher", searchController.bookPuplisher);
router.get("/bookTitle/:title", searchController.bookTitle);

module.exports = router;

// mongodb://127.0.0.1:27017/libraryDB
