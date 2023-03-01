// **************************** imports *******************************
const express = require("express");
const multer = require("multer");
const path = require("path");
const validateMW = require("../Core/validations/validateMW");
const controller = require("../Controller/adminContoller");
const validatePostArray =
  require("../Core/adminValidationArray").validatePostArray;
const validatePatchArray =
  require("../Core/adminValidationArray").validatePatchArray;
const intParam = require("../Core/paramValidation").intParam;
const {
  checkBaseAdmin,
  checkAdmin,
} = require("./../Core/auth/authenticationMW");
const uploadImage = require("../helpers/uploadingImages");
const router = express.Router();

// **************************** upload image *******************************
const upload = uploadImage("admins");
// **************************** routes *******************************
router
  .route("/admins")
  .all(checkBaseAdmin, checkAdmin)
  .get(controller.getAllAdmins)
  .post(
    upload.single("image"),
    validatePostArray,
    validateMW,
    controller.addAdmin
  );
router
  .route("/admins/:id")
  .all(checkBaseAdmin, checkAdmin)
  .get(intParam, validateMW, controller.getAdmin)
  .patch(
    upload.single("image"),
    intParam,
    validatePatchArray,
    validateMW,
    controller.updateAdmin
  )
  .delete(intParam, validateMW, controller.deleteAdmin);

module.exports = router;
