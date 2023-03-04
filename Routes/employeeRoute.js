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
.get(checkAdminOrBadmin,controller.getAllEmployee)
.post(checkAdminOrBadmin,upload.single("image"),validatePostArray,validateMW,controller.addEmployee)
.patch(checkBadminOrAdminOrEmployee,upload.single("image"),validatePatchArray,validateMW,controller.updateEmployee)
.delete(checkAdminOrBadmin,validateDelArray,validateMW,controller.deleteEmployee)




module.exports = router;

// mongodb://127.0.0.1:27017/libraryDB