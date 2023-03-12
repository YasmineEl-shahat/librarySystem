const express =require("express");
const {validatePostArray,validatePatchArray}= require("./../Core/bookValidationArray")
const validateMW = require("./../Core/validations/validateMW");
const controller = require("./../Controller/bookController");
const {checkBadminOrAdminOrEmployeeBook} = require("./../Core/auth/authenticationMW");
// Upload Image
const uploadImage = require("../helpers/uploadingImages");
const upload = uploadImage("Books");

const router = express.Router();
router.route("/books")
.get(checkBadminOrAdminOrEmployeeBook,controller.getAllBooks)
.post(upload.single("image"),checkBadminOrAdminOrEmployeeBook,validatePostArray,validateMW,controller.addBook)
.patch(upload.single("image"),checkBadminOrAdminOrEmployeeBook,validatePatchArray,validateMW,controller.updateBook)


router.route("/books/:id")
.delete(checkBadminOrAdminOrEmployeeBook,validateMW,controller.deleteBook)

router.route("/getNewBooks").get(checkBadminOrAdminOrEmployeeBook,controller.getNewBooks)
router.route("/getBooksYear/:year").get(controller.getBooksYear)
module.exports = router;