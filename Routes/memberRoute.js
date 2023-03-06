const express =require("express");
const {
  checkBadminOrEmployeeOrMember,
  checkBaseAdminOremployee
  } = require("./../Core/auth/authenticationMW");
const {
    validatePostArray,
    validatePatchArray,
  } = require("./../Core/memberValidationArray")
const validateMW = require("./../Core/validations/validateMW");
const controller = require("./../Controller/memberController");
// Upload Image
const uploadImage = require("../helpers/uploadingImages");
const upload = uploadImage("Members");

const router = express.Router();
router.route("/members")
  .get(checkBaseAdminOremployee,controller.getAllMembers)
  .post(upload.single("image"),checkBaseAdminOremployee,validatePostArray,validateMW,controller.addMember)
  .patch(upload.single("image"),checkBadminOrEmployeeOrMember,validatePatchArray,validateMW,controller.updateMember)

router.route("/members/:id")
  .get(checkBadminOrEmployeeOrMember,validateMW,controller.getMember)
  .delete(checkBaseAdminOremployee,validateMW,controller.deleteMember)
module.exports = router;