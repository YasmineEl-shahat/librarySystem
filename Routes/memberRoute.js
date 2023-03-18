const express = require("express");
const {
  checkAdmins,
  checkBadminOrAdminOrEmployee,
  checkBadminOrAdminOrEmployeeOrMember,
} = require("./../Core/auth/authenticationMW");
const {
  validatePostArray,
  validatePatchArray,
} = require("./../Core/memberValidationArray");
const validateMW = require("./../Core/validations/validateMW");
const controller = require("./../Controller/memberController");
// Upload Image
const uploadImage = require("../helpers/uploadingImages");
const upload = uploadImage("Members");

const router = express.Router();
router
  .route("/members")
  .get(checkBadminOrAdminOrEmployee, controller.getAllMembers)
  .post(
    checkBadminOrAdminOrEmployee,
    validatePostArray,
    validateMW,
    controller.addMember
  )
  .patch(
    upload.single("image"),
    checkBadminOrAdminOrEmployeeOrMember,
    validatePatchArray,
    validateMW,
    controller.updateMember
  );

router
  .route("/members/:id")
  .get(checkBadminOrAdminOrEmployeeOrMember, validateMW, controller.getMember)
  .delete(checkBadminOrAdminOrEmployee, validateMW, controller.deleteMember);
router
  .route("/memberSearch/:data")
  .get(checkBadminOrAdminOrEmployee, controller.autoComplete);

/////////nabila//////////
router
  .route("/searchMember/:fullName?/:email?")
  .get(checkAdmins, controller.memberSearch);
module.exports = router;
