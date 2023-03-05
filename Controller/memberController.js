// const {request,response}=require('express');
const mongoose = require('mongoose');
require("./../Model/memberModel");
// Encryot password
const bcrypt = require('bcrypt');
const saltRounds = 10;
const MemberSchema=mongoose.model("members");
// Delete Image
const fs = require("fs")
// const uploadImage = require("../helpers/deletingImages");

exports.getAllMembers=(request,response,next)=>{
    MemberSchema.find({})
    .then(data=>{
        response.status(200).json({data})
    })
    .catch(error=>next(error))
}

exports.getMember=(request,response,next)=>{
    MemberSchema.find({_id:request.params.id})
    .then(data=>{
        if(data.length==0)
            next(new Error("Member not found"));
        else
            response.status(200).json({data});
    })
    .catch(error=>next(error))
}

exports.addMember=(request,response,next)=>{
    let hashPassword= bcrypt.hashSync(request.body.password,bcrypt.genSaltSync(saltRounds));
    new MemberSchema({
        _id:request.body.id,
        fullName:request.body.name,
        email:request.body.email,
        password:hashPassword,
        phoneNumber:request.body.phoneNumber,
        birthdate:request.body.birthdate,
        city:request.body.city,
        street:request.body.street,
        building:request.body.building,
        image:request.file.path
        // createdAt:Date.now();
    }).save() 
    .then(data=>{
     response.status(201).json({data});

    })
    .catch(error=>next(error))
}

exports.updateMember=async (request,response,next)=>{
    try{
        if(request.body.password)
            hashPassword= bcrypt.hashSync(request.body.password,bcrypt.genSaltSync(saltRounds));
        
        let memberData = await MemberSchema.updateOne({
            _id:request.body.id
        },{
            $set:{
                fullName:request.body.name,
                // email:request.body.email,
                password:hashPassword,
                phoneNumber:request.body.phoneNumber,
                birthdate:request.body.birthdate,
                fullAddress:request.body.address,
                image: request.file?.path ? request.file.path : memberData.image
            }
        }).then(data=>{
            if(data.length!=1)
                next(new Error("Member not found"));    
            else
                response.status(200).json({data:"updated"});
        })
    }
    catch(error){
        next(error)
    }
}
exports.deleteMember=async (request,response,next)=>{
    try{
        let imagePath=await MemberSchema.findOne({_id:request.body.id},{image:1,_id:0})
        console.log(`image path`+imagePath.image)
        if(imagePath)
        {
            const pathToImg = imagePath.image;
            fs.unlinkSync(pathToImg);
        }
        else{
            console.log("image not found")
        }
        MemberSchema.deleteOne({
            _id:request.body.id
        }).then(data=>{
            if(data.deletedCount==0)
            {
                next(new Error("Member not found"));
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

