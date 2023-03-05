const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("./../Model/adminModel");
require("./../Model/employeeModel");
require("./../Model/memberModel");
const adminSchema = mongoose.model("admins");
const employeeSchema = mongoose.model("employees");
const memberSchema = mongoose.model("members");

let sk = process.env.SECRET_KEY || "SK";

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}
function authResponse(id, role, response) {
  let token = jwt.sign({ id: id, role: role }, sk, { expiresIn: "3h" });
  response.status(200).json({ message: "Authenticated", token });
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

    if (admin && checkPass) authResponse(admin._id, "admin", response);
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
