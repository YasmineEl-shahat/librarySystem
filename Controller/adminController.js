const mongoose = require("mongoose");
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
  console.log(request.file);
  new adminSchema({
    _id: request.body._id,
    fname: request.body.fname,
    lname: request.body.lname,
    email: request.body.email,
    password: request.body.password,
    salary: request.body.salary,
    birthdate: request.body.birthdate,
    hiredate: request.body.hiredate,
    image: request.file?.path ? request.file.path : "",
  })
    .save()
    .then((data) => response.status(201).json({ data }))
    .catch((error) => next(error));
};

exports.updateAdmin = (request, response, next) => {
  adminSchema
    .updateOne(
      { _id: request.params.id },
      {
        $set: {
          fname: request.body.fname,
          lname: request.body.lname,
          email: request.body.email,
          password: request.body.password,
          salary: request.body.salary,
          birthdate: request.body.birthdate,
          hiredate: request.body.hiredate,
          image: request.file?.path ? request.file.path : "",
        },
      }
    )
    .then((data) => {
      if (data.matchedCount == 0) throw new Error("Admin not found");
      else response.status(200).json({ data: "updated" });
    })
    .catch((error) => next(error));
};
exports.deleteAdmin = (request, response, next) => {
  adminSchema
    .deleteOne({ _id: request.params.id })
    .then((data) => {
      if (data.deletedCount == 0) throw new Error("Admin not found");
      else response.status(200).json({ data: "deleted" });
    })
    .catch((error) => next(error));
};
