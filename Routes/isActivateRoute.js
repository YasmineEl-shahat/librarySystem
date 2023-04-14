const express = require("express");
const controller = require("../Controller/isActivateController");
const intParam = require("../Core/paramValidation").intParam;

const router = express.Router();

router.
route("/employee/isActivate/:id")
.get(intParam, controller.isActivateEmployee);

router.
route("/admin/isActivate/:id")
.get(intParam, controller.isActivateAdmin);

router.
route("/member/isActivate/:id")
.get(intParam, controller.isActivateMember);

module.exports = router;