const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("./../Model/adminModel");
require("./../Model/employeeModel");
require("./../Model/memberModel");
const adminSchema = mongoose.model("admins");
const employeeSchema = mongoose.model("employees");
const memberSchema = mongoose.model("members");
const comparePassword = require("../helpers/comparePassword");
const { SECRET_KEY } = require("../config/env");

//response generator general function
function authResponse(id, role, response) {
  // let token = jwt.sign({ id: id, role: role }, SECRET_KEY, { expiresIn: "3h" });
  let token = jwt.sign({ id: id, role: role }, SECRET_KEY);
  response.status(200).json({
    message: "Authenticated",
    token,
  });
}

//different users login
exports.login = async (request, response, next) => {
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
    checkPass = await comparePassword(request.body.password, employee.password);
  } else if (member) {
    checkPass = await comparePassword(request.body.password, member.password);
  }
  if (admin && checkPass && admin.isBase)
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
};
