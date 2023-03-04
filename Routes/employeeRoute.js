const express =require("express")
const controller = require("./../Controller/employeeController")
const {checkAdminOrBadmin,checkBadminOrAdminOrEmployee,employeeOrAdmin} = require("./../Core/auth/authenticationMW");
const validateMW = require("./../Core/validations/validateMW")
const {validateDelArray,validatePatchArray,validatePostArray}= require("./../Core/employeeValidationArray")
const uploadImage = require("../helpers/uploadingImages");
// upload image
const upload = uploadImage("employee");

const router = express.Router();

router.route("/employee")
.get(checkAdminOrBadmin,controller.getAllEmployee)
.post(upload.single("image"),checkAdminOrBadmin,validatePostArray,validateMW,controller.addEmployee)
.patch(upload.single("image"),checkBadminOrAdminOrEmployee,validatePatchArray,validateMW,controller.updateEmployee)
.delete(checkAdminOrBadmin,validateDelArray,validateMW,controller.deleteEmployee)




module.exports = router;

// mongodb://127.0.0.1:27017/libraryDB