// const {request,response}=require('express');
const mongoose = require('mongoose');
require("./../Model/memberModel");

const MemberSchema=mongoose.model("members");

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
    new MemberSchema({
        _id:request.body.id,
        fullName:request.body.name,
        email:request.body.email,
        password:request.body.password,
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

exports.updateMember=(request,response,next)=>{
    MemberSchema.updateOne({
        _id:request.body.id
    },{
        $set:{
            fullName:request.body.name,
            email:request.body.email,
            password:request.body.password,
            phoneNumber:request.body.phoneNumber,
            birthdate:request.body.birthdate,
            fullAddress:request.body.address,
            image:request.file.path,
            // createdAt:Date.now();
        }
    }).then(data=>{
        if(data.matchedCount==0)
        {
            next(new Error("Member not found"));
        }
        else
        response.status(200).json({data:"updated"});
    })
    .catch(error=>next(error));
}
exports.deleteMember=(request,response,next)=>{
    MemberSchema.deleteOne({
        _id:request.body.id
    }).then(data=>{
        if(data.deletedCount==0)
        {
            next(new Error("Member not found"));
        }
        else
        response.status(200).json({data:"deleted"});
    })
    .catch(error=>next(error));
}

