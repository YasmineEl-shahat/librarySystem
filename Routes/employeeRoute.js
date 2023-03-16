const express = require("express");
const controller = require("./../Controller/employeeController");

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

module.exports = router;

// mongodb://127.0.0.1:27017/libraryDB
