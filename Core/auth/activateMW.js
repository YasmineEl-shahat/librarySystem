const express = require("express")
const mongoose = require("mongoose");
require("./../../Model/adminModel");

const adminSchema = mongoose.model("admins");
module.exports = (request,response,next) =>{
    console.log(request.role)
    if(request.role == 'admin' || request.role == 'badmin' ){
        adminSchema.findOne({_id:request.id},{image:1})
        .then(data=>{
           if(data.image) next();
           else next( new Error("not activated"))
        })
    }
}