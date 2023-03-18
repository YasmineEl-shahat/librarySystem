// **************************** imports *******************************
const express = require("express");
const validateMW = require("../Core/validations/validateMW");
const controller = require("../Controller/adminController");
const mail = require("../helpers/sendingMail");
const validatePostArray =
  require("../Core/adminValidationArray").validatePostArray;
const validatePatchArray =
  require("../Core/adminValidationArray").validatePatchArray;
const intParam = require("../Core/paramValidation").intParam;
const {
  checkBaseAdmin,
  checkAdminOrBadmin,
} = require("./../Core/auth/authenticationMW");
const uploadImage = require("../helpers/uploadingImages");
const router = express.Router();

// **************************** upload image *******************************
const upload = uploadImage("admins");
// **************************** routes *******************************
router
  .route("/admins")
  .all(checkBaseAdmin)
  .get(controller.getAllAdmins)
  .post(validatePostArray, validateMW, controller.addAdmin);
router
  .route("/admin/:id")
  .all(checkAdminOrBadmin)
  .get(intParam, validateMW, controller.getAdmin)
  .patch(
    upload.single("image"),
    intParam,
    validatePatchArray,
    validateMW,
    controller.updateAdmin
  )
  .delete(intParam, validateMW, controller.deleteAdmin);

// router.post("/testmail",mail.sendEmail)

module.exports = router;
