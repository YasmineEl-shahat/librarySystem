const express = require("express");
const controller = require("./../Controller/employeeController");

const {
  checkAdminOrBadmin,
  checkBadminOrAdminOrEmployee,
  checkAdmins,
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
  .get(checkAdmins, controller.getAllEmployee)
  .post(checkAdmins, validatePostArray, validateMW, controller.addEmployee);

router
  .route("/employee/:id")
  .get(
    intParam,
    checkBadminOrAdminOrEmployee,
    validateMW,
    controller.getEmployee
  )
  .patch(
    upload.single("image"),
    intParam,
    checkBadminOrAdminOrEmployee,
    validatePatchArray,
    validateMW,
    validatePatchArray,
    validateMW,
    controller.updateEmployee
  )
  .delete(checkAdmins, validateDelArray, validateMW, controller.deleteEmployee);

router.route("/search/:data?").get(checkAdmins, controller.autoComplete);
module.exports = router;

// mongodb://127.0.0.1:27017/libraryDB
