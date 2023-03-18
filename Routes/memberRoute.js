const express = require("express");
const {
  checkAdmins,
  checkBaseAdminOremployee,
  checkBadminOrAdminOrEmployee,
  checkBadminOrEmployeeOrMember,
  checkBadminOrAdminOrEmployeeOrMember
} = require("./../Core/auth/authenticationMW");
const {
  validatePostArray,
  validatePatchArray,
} = require("./../Core/memberValidationArray");
const validateMW = require("./../Core/validations/validateMW");
const controller = require("./../Controller/memberController");
const intParam = require("../Core/paramValidation").intParam;
// Upload Image
const uploadImage = require("../helpers/uploadingImages");
const upload = uploadImage("Members");

const router = express.Router();
router
  .route("/members")
  .get(checkBadminOrAdminOrEmployee, controller.getAllMembers)
  .post(
    checkBadminOrEmployeeOrMember,
    validatePostArray,
    validateMW,
    controller.addMember
  );

router
  .route("/members/:id")
  .get(checkBadminOrAdminOrEmployeeOrMember, intParam, controller.getMember)
  .patch(
    upload.single("image"),
    checkBadminOrEmployeeOrMember,
    validatePatchArray,
    validateMW,
    controller.updateMember
  )
  .delete(checkBadminOrAdminOrEmployee, intParam, controller.deleteMember);
router
  .route("/memberSearch/:data")
  .get(checkBaseAdminOremployee, controller.autoComplete);

router
  .route("/searchMember/:fullName?/:email?")
  .get(checkAdmins, controller.memberSearch);
module.exports = router;
