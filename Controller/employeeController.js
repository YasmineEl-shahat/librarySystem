const { request, response } = require("express");
const mongoose = require("mongoose")
require("./../Model/employeeModel")
const bcrypt = require("bcrypt")
// Delete Image
const fs = require("fs")

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



exports.updateEmployee = async (request , response , next)=>{
    if(request.body.password){
        let hash = bcrypt.hashSync(request.body.password, saltRounds)
    }
    else{
        let hash=request.body.password;
    }
    // delete image from server
    try{
        let employee=await employeeSchema.findOne({_id:request.body._id},{image:1,_id:0})
        console.log("path: " , employee.image)
        if(employee)
        {
            const pathToImg = employee.image;
            fs.unlinkSync(pathToImg);
        }
    }
    catch(error){
        next(new Error("image not found " ))
    }
    if(request.role=="employee"){
        delete request.body.email
        delete request.body.hiredate
        delete request.body.salary
    }
        employeeSchema.updateOne(
            {_id: request.body._id},
            { 
                $set: {
                    fname:request.body.fname,
                    lname:request.body.lname,
                    email:request.body.email,
                    password:hash,
                    salary: request.body.salary,
                    birthdate: request.body.birthdate,
                    hiredate: request.body.hiredate,
                    image: request.file?.path ? request.file.path : ""
                }
            }
        ).then( (data) => {
            if(data.matchedCount == 0)
                next(new Error("employee not found for update"))
            else response.status(200).json({data})
        })
        .catch(error => next(error))
    
    //update with role employee
//     else if (request.role == "employee"){
//     if(request.body.email !=null){
//         next(new Error("you can't update your email "));
//     }
//     else if(request.body.hiredate !=null){
//         next(new Error("you can't update your hiredate "));
//     }
//     else if(request.body.salary !=null){
//         next(new Error("you can't update your salary "));
//     }
//     else{
//     employeeSchema.updateOne(
//         {_id: request.body._id},
//         { 
//             $set: {
//                 fname:request.body.fname,
//                 lname:request.body.lname,
//                 // password:hash,
//                 birthdate: request.body.birthdate,
//                 image: request.file?.path ? request.file.path : ""
//             }
//         }
//     ).then( (data) => {
//         if(data.matchedCount == 0)
//             next(new Error("employee not found for update"))
//         else response.status(200).json({data})
//     })
//     .catch(error => next(error))
// }
// }
// else {
//     next(Error);
// }
}

exports.deleteEmployee=async (request,response,next)=>{
    try{
        let employee=await employeeSchema.findOne({_id:request.body._id},{image:1,_id:0})
        if(employee)
        {
            const pathToImg = employee.image;
            fs.unlinkSync(pathToImg);
        }
       
        
        employeeSchema.deleteOne({
            _id:request.body._id
        }).then(data=>{
            if(data.deletedCount==0)
            {
                next(new Error("employee not found"));
            }
            else
                response.status(200).json({data:"deleted"});
                console.log(data)
        })
       
    }
    catch(error){
        next(error)
    }
}
