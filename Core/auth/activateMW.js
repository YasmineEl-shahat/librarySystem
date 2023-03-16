const mongoose = require("mongoose");
require("./../../Model/adminModel");
require("./../../Model/employeeModel");
require("./../../Model/memberModel");
const comparePassword = require("./../../helpers/comparePassword");
const adminSchema = mongoose.model("admins");
const employeeSchema = mongoose.model("employees");
const membersSchema = mongoose.model("members");

module.exports = async (request, response, next) => {
  // check activate admin or badmin
  if (request.role == "admin" || request.role == "badmin") {
    const admin = await adminSchema.findOne(
      { _id: request.id },
      { password: 1 }
    );
    if (await comparePassword("newAd12_", admin.password))
      next(new Error("not activated"));
    else next();

    // check activate employee
  } else if (request.role == "employee") {
    const employee = await employeeSchema.findOne(
      { _id: request.id },
      { password: 1 }
    );
    if (await comparePassword("newEmp12_", employee.password))
      next(new Error("not activated"));
    else next();
    // check activate memeber
  } else {
    const member = await membersSchema.findOne(
      { _id: request.id },
      { password: 1 }
    );
    if (await comparePassword("newMe12_", member.password))
      next(new Error("not activated"));
    else next();
  }
};
