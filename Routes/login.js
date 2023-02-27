const express = require("express");
const router = express.Router();
const loginController = require("../Controller/loginController").login;

router.post("/login", loginController);

module.exports = router;
