const mongoose = require("mongoose");
const fs = require("fs");

require("../Model/adminModel");
const adminSchema = mongoose.model("admins");
const genHashedPassword = require("../helpers/genHashedPassword");
const Mail = require("../helpers/sendingMail");
const comparePassword = require("../helpers/comparePassword");
const { DEFAULTPASS } = require("../config/env");

const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 10 });
//get all admins in system
exports.getAllAdmins = async (request, response, next) => {
  const key = "AllAdmins";
  const cachedAdmins = myCache.get(key);
  if (cachedAdmins) {
    console.log(`Restored From Cache`);
    response.setHeader("Cache-Control", "max-age=6*30*24*60");
    return response.sendStatus(304);
  }
  const admins = await adminSchema
    .find({})
    .then((data) => {
      myCache.set(key, data);
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//get admin using param
exports.getAdmin = (request, response, next) => {
  adminSchema
    .findOne({ _id: request.params.id })
    .then((data) => {
      if (data) response.status(200).json({ data });
      else throw new Error("admin not found");
    })
    .catch((error) => next(error));
};

//add admin
exports.addAdmin = (request, response, next) => {
  new adminSchema({
    _id: request.body._id,
    fname: request.body.fname,
    lname: request.body.lname,
    email: request.body.email,
    isBase: request.body.isBase,
    salary: request.body.salary,
    birthdate: request.body.birthdate,
    hiredate: request.body.hiredate,
  })
    .save()
    .then((data) => {
      Mail(data.email, DEFAULTPASS);
      response.status(201).json({ data });
    })
    .catch((error) => next(error));
};

//update admin using parameters
exports.updateAdmin = async (request, response, next) => {
  try {
    let hashPassword = null;
    let pathToImg = null;
    let adminData = await adminSchema.findOne({ _id: request.params.id });
    if (!adminData) throw new Error("Admin not found");

    if (request.role == "admin" && adminData.isBase)
      throw new Error("you can't update the owner data");
    if (adminData.isBase && request.id !== 2 && adminData._id == 2)
      throw new Error("you can't update super base admin data");
    // first time login baseAdmin update to image
    if (
      (adminData.image == undefined && request.file) ||
      (await comparePassword(DEFAULTPASS, adminData.password))
    ) {
      throw new Error(
        "You Can Not Update Image OR Password Before Member First Login"
      );
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

//delete admin using parameters
exports.deleteAdmin = async (request, response, next) => {
  let adminData = await adminSchema.findOne({ _id: request.params.id });
  if (!adminData) next(new Error("Admin not found"));
  else if (request.role == "admin" && adminData.isBase)
    next(new Error("you can't delete the owner data"));
  else if (adminData.isBase && adminData._id == 2)
    next(new Error("you can't delete super base admin data"));
  else {
    if (adminData?.image) {
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
  }
};
