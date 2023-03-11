const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

require("./../Model/adminModel");
require("./../Model/employeeModel");
require("./../Model/memberModel");
const adminSchema = mongoose.model("admins");
const employeeSchema = mongoose.model("employees");
const memberSchema = mongoose.model("members");
const comparePassword = require("../helpers/comparePassword");

let sk = process.env.SECRET_KEY || "SK";

function authResponse(id, role, response, errorMsg) {
  let token = jwt.sign({ id: id, role: role }, sk, { expiresIn: "3h" });
  response
    .status(200)
    .json({ message: "Authenticated " + errorMsg ?? "", token });
}
exports.login = async (request, response, next) => {
  if (
    request.body.email == "basicAdmin@gmail.com" &&
    request.body.password == "123"
  )
    authResponse(1, "badmin", response);
  else {
    let admin = await adminSchema.findOne({
      email: request.body.email,
    });
    let employee = await employeeSchema.findOne({
      email: request.body.email,
    });
    let member = await memberSchema.findOne({
      email: request.body.email,
    });
    if (admin) {
      checkPass = await comparePassword(request.body.password, admin.password);
    } else if (employee) {
      checkPass = await comparePassword(
        request.body.password,
        employee.password
      );
    } else if (member) {
      checkPass = await comparePassword(request.body.password, member.password);
    }
    if (admin && request.body.password == "newAd12_") {
      authResponse(
        admin._id,
        "admin",
        response,
        ",you have to change the previously created pass"
      );
    } else if (admin && admin.isBase && request.body.password == "newAd12_") {
      authResponse(
        admin._id,
        "badmin",
        response,
        ",you have to change the previously created pass"
      );
    } else if (admin && checkPass && admin.isBase)
      authResponse(admin._id, "badmin", response);
    else if (admin && checkPass) authResponse(admin._id, "admin", response);
    else if (employee && checkPass)
      authResponse(employee._id, "employee", response);
    else if (member && checkPass) authResponse(member._id, "member", response);
    else {
      let error = new Error("Not Authenticated");
      error.status = 401;
      next(error);
    }
  }
};
