const { request, response } = require("express");
const mongoose = require("mongoose")
require("./../Model/employeeModel")
const bcrypt = require("bcrypt")

const employeeSchema = mongoose.model("employees");

const saltRounds=10;
exports.getAllEmployee = (request , response ,next)=>{
    employeeSchema.find({})
    .then(data => response.status(201).json({data}))
    .catch(error => next(error))
}

exports.addEmployee = (request , response , next)=>{
    let hash = bcrypt.hashSync(request.body.password , saltRounds)
    
        new employeeSchema ({
            _id: request.body._id,
            fname:request.body.fname,
            lname:request.body.lname,
            email:request.body.email,
            password:hash,
            salary: request.body.salary,
            birthdate: request.body.birthdate,
            hiredate: request.body.hiredate,
            image: request.file?.path ? request.file.path : ""
        }).save()
        .then(data => response.status(201).json({data}))
        .catch(error => next(error))
    }
    


exports.updateEmployee = (request , response , next)=>{
    let hash = bcrypt.hashSync(request.body.password, saltRounds)
    if(request.body.email !=null){
        next(new Error("you can't update your email "));
    }
    else if(request.body.hiredate !=null){
     next(new Error("you can't update your hiredate "));}
    else if(request.body.salary !=null){
        next(new Error("you can't update your salary "));
    }
    else{
    employeeSchema.updateOne(
        {_id: request.body._id},
        { 
            $set: {
                fname:request.body.fname,
                lname:request.body.lname,
                // email:request.body.email,
                password:hash,
                // salary: request.body.salary,
                birthdate: request.body.birthdate,
                // hiredate: request.body.hiredate,
                image: request.file?.path ? request.file.path : ""
            }
        }
    ).then( (data) => {
        if(data.matchedCount == 0)
            next(new Error("employee not found for update"))
        else response.status(200).json({data})
    })
    .catch(error => next(error))
}
}

exports.deleteEmployee = (request,response,next)=>{
    employeeSchema.deleteOne( {_id:request.body._id })
    .then( (data) =>{
        if(data.deletedCount ==0)
            next(new Error("employee not found for delete"))
        else response.status(200).json({data})
    }).catch(error => next(error))
}

/***********************nabila************** */