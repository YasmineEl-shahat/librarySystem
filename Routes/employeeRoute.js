const express =require("express")
const controller = require("./../Controller/employeeController")
const {checkAdminOrBadmin,checkBadminOrAdminOrEmployee} = require("./../Core/auth/authenticationMW");
const validateMW = require("./../Core/validations/validateMW")
const {validateDelArray,validatePatchArray,validatePostArray}= require("./../Core/employeeValidationArray")
const uploadImage = require("../helpers/uploadingImages");
// upload image
const upload = uploadImage("employee");

const router = express.Router();

router.route("/employee")
.all(checkBaseAdmin)
.get(controller.getAllEmployee)
.post(upload.single("image"),validatePostArray,validateMW,controller.addEmployee)
.patch(upload.single("image"),validatePatchArray,validateMW,controller.updateEmployee)
.delete(validateDelArray,validateMW,controller.deleteEmployee)




module.exports = router;

// mongodb://127.0.0.1:27017/libraryDB