const mongoose = require("mongoose");
require("./../Model/employeeModel");
// const sendMail = require("./../helpers/sendMails")
const comparePassword = require("../helpers/comparePassword");
const genHashedPassword = require("../helpers/genHashedPassword");

// Delete Image
const fs = require("fs");

const employeeSchema = mongoose.model("employees");

exports.getAllEmployee = (request, response, next) => {
  employeeSchema
    .find({})
    .then((data) => response.status(201).json({ data }))
    .catch((error) => next(error));
};
exports.getEmployee = (request, response, next) => {
  employeeSchema
    .findOne({ _id: request.params.id })
    .then((data) => {
      if (data) response.status(200).json({ data });
      else throw new Error("employee not found");
    })
    .catch((error) => next(error));
};
exports.addEmployee = (request, response, next) => {
  let hash = request.body.password;
  if (request.body.password) hash = genHashedPassword(request.body.password);
  new employeeSchema({
    _id: request.body._id,
    fname: request.body.fname,
    lname: request.body.lname,
    email: request.body.email,
    password: hash,
    salary: request.body.salary,
    // birthdate: request.body.birthdate,
    hiredate: request.body.hiredate,
  })
    .save()
    .then((data) => {

      response.status(201).json({ data })
    })
    .catch((error) => next(error));
};

// update employee
exports.updateEmployee = async (request, response, next) => {
  let isFirstLog = false;
  if (request.role == "employee") {
    delete request.body.email;
    delete request.body.salary;
  }
  try {
    let employee = await employeeSchema.findOne({ _id: request.params.id });
    if (!employee) throw new Error("Employee not found");
    let pass = employee.password;
    // first time login
    if (
      (await comparePassword("newEmp12_", pass)) &&
      (!request.body.password || !request.body.birthdate || !request.file)
    ) {
      isFirstLog = true;
      throw new Error("you have to complete your data!");
    }

    // delete image from server before update
    if (employee.image && isFirstLog == false) {
      fs.unlinkSync(employee.image);
    }

    hash = request.body.password;
    if (request.body.password) hash = genHashedPassword(request.body.password);

    employeeSchema
      .updateOne(
        { _id: request.params.id },
        {
          $set: {
            fname: request.body.fname,
            lname: request.body.lname,
            email: request.body.email,
            password: hash,
            salary: request.body.salary ,
            birthdate: request.body.birthdate,
            image: request.file?.path ,
          },
        }
      )
      .then((data) => {
        if (data.matchedCount == 0)
          next(new Error("employee not found for update"));
        else response.status(200).json({ data: "updated" });
      })
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
};

// delete employee
exports.deleteEmployee = async (request, response, next) => {
  try {
    let employee = await employeeSchema.findOne(
      { _id: request.body._id },
      { image: 1, _id: 0 }
    );
    if (employee) {
      const pathToImg = employee.image;
      fs.unlinkSync(pathToImg);
    }

    employeeSchema
      .deleteOne({
        _id: request.body._id,
      })
      .then((data) => {
        if (data.deletedCount == 0) {
          next(new Error("employee not found"));
        } else response.status(200).json({ data: "deleted" });
        console.log(data);
      });
  } catch (error) {
    next(error);
  }
};
