const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("./../Model/employeeModel")
require("./../Model/adminModel")
const employeeSchema = mongoose.model("employees")
const adminSchema = mongoose.model("admins")

let sk = process.env.SECRET_KEY || "SK";

exports.login = async(request, response, next) => {
  if (request.body.username == "basicAdmin" && request.body.password == "123") {
    let token = jwt.sign({ id: 1, role: "badmin" }, sk, { expiresIn: "3h" });
    response.status(200).json({ message: "Authenticated", token });
  } 

  else {

    // console.log(request.body.username)
    // console.log(request.body.password)
    let admin = await  adminSchema.findOne({fname:request.body.username , password:request.body.password})
    let employee = await employeeSchema.findOne({fname:request.body.username , password:request.body.password})
    // console.log(admin)
    // console.log(employee)
    if(admin){
      let token = jwt.sign({ id: admin._id, role: "admin" }, sk, { expiresIn: "3h" });
      response.status(200).json({ message: "Authenticated", token });
    }
    else if(employee ){
      console.log(employee)
      let token = jwt.sign({ id: employee._id, role: "employee" }, sk, { expiresIn: "3h" });
      response.status(200).json({ message: "Authenticated", token });
    }
    else {
      let error = new Error("Not Authenticated");
      error.status = 401;
      next(error);
    }

}
};
