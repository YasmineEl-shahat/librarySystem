const express = require("express");
const {
  checkBaseAdminOremployee,
  checkBadminOrAdminOrEmployee,
  checkBadminOrEmployeeOrMember,
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
    checkBadminOrEmployeeOrMember,
    validatePostArray,
    validateMW,
    controller.addMember
  )
  .patch(
    upload.single("image"),
    checkBadminOrEmployeeOrMember,
    validatePatchArray,
    validateMW,
    controller.updateMember
  );

router
  .route("/members/:id")
  .get(checkBadminOrEmployeeOrMember, validateMW, controller.getMember)
  .delete(checkBaseAdminOremployee, validateMW, controller.deleteMember);
router
  .route("/memberSearch/:data")
  .get(checkBaseAdminOremployee, controller.autoComplete);

/////////nabila//////////
router
  .route("/searchMember/:fullName?/:email?")
  .get(checkAdmins, controller.memberSearch);
module.exports = router;
