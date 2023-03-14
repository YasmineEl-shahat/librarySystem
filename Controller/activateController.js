const mongoose = require("mongoose");
require("./../Model/adminModel");
require("./../Model/employeeModel");
require("./../Model/memberModel");
const adminSchema = mongoose.model("admins");
const employeeSchema = mongoose.model("employees");
const membersSchema = mongoose.model("members");
const genHashedPassword = require("../helpers/genHashedPassword");

exports.activateEmployee = async (request, response, next) => {
  // activate account
  if (!request.file) {
    next(
      new Error(
        "you have add image to complete your data to activate your acount!"
      )
    );
  }
  if (request.body.password == "newEmp12_")
    next(new Error("you have change your password"));
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
};

exports.activateAdmin = async (request, response, next) => {
  // activate account
  if (!request.file) {
    next(
      new Error(
        "you have add image to complete your data to activate your acount!"
      )
    );
  }
  if (request.body.password == "newAd12_")
    next(new Error("you have change your password"));
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
};

exports.activateMember = async (request, response, next) => {
  // activate account
  if (!request.file) {
    next(
      new Error(
        "you have add image to complete your data to activate your acount!"
      )
    );
  }
  if (request.body.password == "newMe12_")
    next(new Error("you have change your password"));
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
};
