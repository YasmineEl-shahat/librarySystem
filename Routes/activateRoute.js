const express = require("express");
const controller = require("../Controller/activateController");
const validateMW =require("../Core/validations/validateMW")
const {validateActivateArray} =require("../Core/activateValidarionArray")
const {checkAdminsActivate,checkEmployeeActivate,checkMemberActivate}=require("../Core/auth/authenticationMW")
const intParam = require("../Core/paramValidation").intParam;

const uploadImage = require("../helpers/uploadingImages");
const router = express.Router();

router.
route("/admin/activate/:id")
.patch(uploadImage("admins").single("image"),intParam,checkAdminsActivate,validateActivateArray,validateMW, controller.activateAdmin);

router.
route("/employee/activate/:id")
.patch(uploadImage("employee").single("image"),intParam,checkEmployeeActivate,validateActivateArray,validateMW, controller.activateEmployee);

router.
route("/member/activate/:id")
.patch(uploadImage("member").single("image"),intParam,checkMemberActivate,validateActivateArray,validateMW, controller.activateMember);





module.exports = router;