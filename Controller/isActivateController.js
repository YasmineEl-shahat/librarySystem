const mongoose = require("mongoose");
require("./../Model/employeeModel");
const comparePassword = require("../helpers/comparePassword");
const genHashedPassword = require("../helpers/genHashedPassword");
const Mail = require("../helpers/sendingMail");
const { DEFAULTPASS } = require("../config/env");
// Delete Image
const fs = require("fs");
const { request } = require("http");
const { response } = require("express");

const employeeSchema = mongoose.model("employees");
const adminSchema = mongoose.model("admins");
const memberSchema = mongoose.model("members");

//get specific employee using param
exports.isActivateEmployee = (request, response, next) => {
  employeeSchema
    .findOne({ _id: request.params.id } , {password:1 , image:1})
    .then(async (data) => {
      if (!data) throw new Error("employee not found"); 
      else if(!data.image && await comparePassword(DEFAULTPASS, data.password)) response.status(200).json({ activate:"false" });
      else response.status(200).json({ activate:"true" });
    })
    .catch((error) => next(error));
};

exports.isActivateAdmin = (request, response, next) => {
    adminSchema
      .findOne({ _id: request.params.id } , {password:1 , image:1})
      .then(async(data) => {
        if (!data) throw new Error("admin not found"); 
        else if(!data.image &&  await comparePassword(DEFAULTPASS, data.password)) response.status(200).json({ activate:"false" });
        else response.status(200).json({ activate:"true" });
      })
      .catch((error) => next(error));
  };

  exports.isActivateMember = (request, response, next) => {
    memberSchema
      .findOne({ _id: request.params.id } , {password:1 , image:1})
      .then(async(data) => {
        if (!data) throw new Error("member not found"); 
        else if(!data.image && await comparePassword(DEFAULTPASS, data.password)) response.status(200).json({ activate:"false" });
        else response.status(200).json({ activate:"true" });
      })
      .catch((error) => next(error));
  };