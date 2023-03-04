const express =require("express");
const {checkBaseAdmin,checkAdmin,} = require("./../Core/auth/authenticationMW");
const {validatePostArray,validatePatchArray}= require("./../Core/memberValidationArray")
const validateMW = require("./../Core/validations/validateMW");
const controller = require("./../Controller/memberController");
// Upload Image
const uploadImage = require("../helpers/uploadingImages");
const upload = uploadImage("Members");

const router = express.Router();
router.route("/members")
.all(checkBaseAdmin)
.get(controller.getAllMembers)
.post(upload.single("image"),validatePostArray,validateMW,controller.addMember)
.patch(upload.single("image"),validatePatchArray,validateMW,controller.updateMember)
.delete(validateMW,controller.deleteMember)

module.exports = router;