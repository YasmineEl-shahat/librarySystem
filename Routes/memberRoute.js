const express =require("express");
const {
  baseAdminOremployee,
  checkMember
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
  .all(baseAdminOremployee)
  .get(checkMember,controller.getAllMembers)
  .post(upload.single("image"),validatePostArray,validateMW,controller.addMember)
  .patch(upload.single("image"),validatePatchArray,validateMW,controller.updateMember)

router.route("/members/:id")
  .all(baseAdminOremployee)
  .get(validateMW,controller.getMember)
  .delete(validateMW,controller.deleteMember)
module.exports = router;