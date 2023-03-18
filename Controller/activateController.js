const mongoose = require("mongoose");
require("./../Model/adminModel");
require("./../Model/employeeModel");
require("./../Model/memberModel");
const adminSchema = mongoose.model("admins");
const employeeSchema = mongoose.model("employees");
const membersSchema = mongoose.model("members");
const genHashedPassword = require("../helpers/genHashedPassword");
const { DEFAULTPASS } = require("../config/env");
exports.activateEmployee = async (request, response, next) => {
  // activate account
  if (!request.file) {
    next(
      new Error(
        "you have add image to complete your data to activate your acount!"
      )
    );
  } else if (request.body.password == DEFAULTPASS)
    next(new Error("you have change your password"));
  else {
    let employee = await employeeSchema.findOne(
      { _id: request.params.id },
      { image: 1 }
    );
    if (employee.image) next(new Error("you are aready activated"));
    else {
      employeeSchema
        .updateOne(
          { _id: request.id },
          {
            $set: {
              password: genHashedPassword(request.body.password),
              image: request.file.path,
            },
          }
        )
        .then((data) => {
          response.status(200).json({ data: "activated successfully!" });
        })
        .catch((error) => next(error));
    }
  }
};

exports.activateAdmin = async (request, response, next) => {
  // activate account
  if (!request.file) {
    next(
      new Error(
        "you have add image to complete your data to activate your acount!"
      )
    );
  } else if (request.body.password == DEFAULTPASS)
    next(new Error("you have change your password"));
  else {
    let admin = await adminSchema.findOne(
      { _id: request.params.id },
      { image: 1 }
    );
    if (admin.image) next(new Error("you are aready activated"));
    else {
      adminSchema
        .updateOne(
          { _id: request.id },
          {
            $set: {
              password: genHashedPassword(request.body.password),
              image: request.file.path,
            },
          }
        )
        .then((data) => {
          response.status(200).json({ data: "activated successfully!" });
        })
        .catch((error) => next(error));
    }
  }
};

exports.activateMember = async (request, response, next) => {
  // activate account
  if (!request.file) {
    next(
      new Error(
        "you have add image to complete your data to activate your acount!"
      )
    );
  } else if (request.body.password == DEFAULTPASS)
    next(new Error("you have change your password"));
  else {
    let member = await membersSchema.findOne(
      { _id: request.params.id },
      { image: 1 }
    );
    if (member.image) next(new Error("you are aready activated"));
    else {
      membersSchema
        .updateOne(
          { _id: request.id },
          {
            $set: {
              password: genHashedPassword(request.body.password),
              image: request.file.path,
            },
          }
        )
        .then((data) => {
          response.status(200).json({ data: "activated successfully!" });
        })
        .catch((error) => next(error));
    }
  }
};
