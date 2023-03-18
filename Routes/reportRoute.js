const express = require("express");
const controller = require("./../Controller/reportController");
const { checkAdmins } = require("./../Core/auth/authenticationMW");

const router = express.Router();
router.route("/report").get(checkAdmins, controller.report);

module.exports = router;
