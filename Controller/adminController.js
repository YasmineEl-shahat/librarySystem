const mongoose = require("mongoose");
const fs = require("fs");

require("../Model/adminModel");
const adminSchema = mongoose.model("admins");
const genHashedPassword = require("../helpers/genHashedPassword");

exports.getAllAdmins = (request, response, next) => {
  adminSchema
    .find({})
    .then((data) => response.status(200).json({ data }))
    .catch((error) => next(error));
};
exports.getAdmin = (request, response, next) => {
  adminSchema
    .findOne({ _id: request.params.id })
    .then((data) => {
      if (data) response.status(200).json({ data });
      else throw new Error("admin not found");
    })
    .catch((error) => next(error));
};

exports.addAdmin = (request, response, next) => {
  // let hashPassword = request.body.password;
  // if (request.body.password)
  //   hashPassword = genHashedPassword(request.body.password);

  new adminSchema({
    _id: request.body._id,
    fname: request.body.fname,
    lname: request.body.lname,
    email: request.body.email,
    isBase: request.body.isBase,
    // password: hashPassword,
    salary: request.body.salary,
    birthdate: request.body.birthdate,
    hiredate: request.body.hiredate,
  })
    .save()
    .then((data) => response.status(201).json({ data }))
    .catch((error) => next(error));
};

exports.updateAdmin = async (request, response, next) => {
  try {
    let hashPassword = null;
    let pathToImg = null;
    let adminData = await adminSchema.findOne({ _id: request.params.id });
    if (!adminData) throw new Error("Admin not found");
    // first time login baseAdmin update to image
    if (adminData.image == undefined && request.body.image) {
      fs.unlinkSync(request.file.path);
      delete request.file.path;
      delete request.body.password;

    }

    if (request.body.password)
      hashPassword = genHashedPassword(request.body.password);
    if (
      request.role == "admin" &&
      (request.body.hiredate || request.body.salary)
    )
      throw new Error("you are not allowed to update salary or hiredate!");
    if (adminData) {
      pathToImg = adminData.image;
    }
    await adminSchema
      .updateOne(
        { _id: request.params.id },
        {
          $set: {
            fname: request.body.fname,
            lname: request.body.lname,
            email: request.body.email,
            password: hashPassword ?? adminData.password,
            salary: request.body.salary,
            birthdate: request.body.birthdate,
            hiredate: request.body.hiredate,
            image: request.file ? request.file.path : adminData.image,
          },
        }
      )
      .then((data) => {
        if (pathToImg && request.file?.path) fs.unlinkSync(pathToImg);
        if (data.matchedCount == 0) throw new Error("Admin not found");
        else response.status(200).json({ data: "updated" });
      })
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
};
exports.deleteAdmin = async (request, response, next) => {
  let adminData = await adminSchema.findOne(
    { _id: request.params.id },
    { image: 1, _id: 0 }
  );
  if (adminData) {
    const pathToImg = adminData.image;
    fs.unlinkSync(pathToImg);
  }
  adminSchema
    .deleteOne({ _id: request.params.id })
    .then((data) => {
      if (data.deletedCount == 0) throw new Error("Admin not found");
      else response.status(200).json({ data: "deleted" });
    })
    .catch((error) => next(error));
};
