const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

let sk = process.env.SECRET_KEY || "SK";

exports.login = (request, response, next) => {
  if (request.body.username == "basicAdmin" && request.body.password == "123") {
    let token = jwt.sign({ id: 1, role: "badmin" }, sk, { expiresIn: "3h" });
    response.status(200).json({ message: "Authenticated", token });
  } else {
    let error = new Error("Not Authenticated");
    error.status = 401;
    next(error);
  }
};
