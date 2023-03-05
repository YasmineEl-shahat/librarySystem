const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("../Model/adminModel");
const adminSchema = mongoose.model("admins");

exports.getAllAdmins = (request, response, next) => {
  adminSchema
    .find({})
    .then((data) => response.status(200).json({ data }))
    .catch((error) => next(error));
};
exports.getAdmin = (request, response, next) => {
  adminSchema
    .findOne({ _id: request.params.id })
    .then((data) => response.status(200).json({ data }))
    .catch((error) => next(error));
};

exports.addAdmin = (request, response, next) => {
  let hashPassword = bcrypt.hashSync(
    request.body.password,
    bcrypt.genSaltSync(saltRounds)
  );
  new adminSchema({
    _id: request.body._id,
    fname: request.body.fname,
    lname: request.body.lname,
    email: request.body.email,
    password: hashPassword,
    salary: request.body.salary,
    birthdate: request.body.birthdate,
    hiredate: request.body.hiredate,
    image: request.file?.path ? request.file.path : "",
  })
    .save()
    .then((data) => response.status(201).json({ data }))
    .catch((error) => next(error));
};

exports.updateAdmin = async (request, response, next) => {
  try {
    if (request.body.password)
      hashPassword = bcrypt.hashSync(
        request.body.password,
        bcrypt.genSaltSync(saltRounds)
      );
    if (
      request.role == "admin" &&
      (request.body.hiredate || request.body.salary)
    )
      throw new Error("you are not allowed to update salary or hiredate");
    if (
      request.role == "admin" &&
      (request.body.password == "newAd12_" || !request.body.password)
    )
      throw new Error("you have to change the previously created pass");
    let adminData = await adminSchema
      .updateOne(
        { _id: request.params.id },
        {
          $set: {
            fname: request.body.fname,
            lname: request.body.lname,
            email: request.body.email,
            password: hashPassword,
            salary: request.body.salary,
            birthdate: request.body.birthdate,
            hiredate: request.body.hiredate,
            image: request.file?.path ? request.file.path : adminData.image,
          },
        }
      )
      .then((data) => {
        if (adminData) {
          const pathToImg = adminData.image;
          fs.unlinkSync(pathToImg);
        }
        if (data.matchedCount == 0) throw new Error("Admin not found");
        else response.status(200).json({ data: "updated" });
      });
  } catch (error) {
    next(error);
  }
};
exports.deleteAdmin = async (request, response, next) => {
  try {
    let adminData = await adminSchema.findOne(
      { _id: request.params.id },
      { image: 1, _id: 0 }
    );
    if (adminData) {
      const pathToImg = adminData.image;
      fs.unlinkSync(pathToImg);
    }
    adminSchema.deleteOne({ _id: request.params.id }).then((data) => {
      if (data.deletedCount == 0) throw new Error("Admin not found");
      else response.status(200).json({ data: "deleted" });
    });
  } catch (error) {
    next(error);
  }
};
