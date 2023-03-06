const express =require("express");
const {validatePostArray,validatePatchArray}= require("./../Core/bookValidationArray")
const validateMW = require("./../Core/validations/validateMW");
const controller = require("./../Controller/bookController");
// Upload Image
const uploadImage = require("../helpers/uploadingImages");
const upload = uploadImage("Books");

const router = express.Router();
router.route("/books")
.get(controller.getAllBooks)
.post(upload.single("image"),validatePostArray,validateMW,controller.addBook)
.patch(upload.single("image"),validatePatchArray,validateMW,controller.updateBook)


router.route("/books/:id")
.delete(validateMW,controller.deleteBook)

router.route("/getNewBooks").get(controller.getNewBooks)
module.exports = router;