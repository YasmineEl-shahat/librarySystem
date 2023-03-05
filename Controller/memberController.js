const mongoose = require('mongoose');
require("./../Model/memberModel");
// Encryot password
const bcrypt = require('bcrypt');
const saltRounds = 10;
const MemberSchema=mongoose.model("members");
const fs = require("fs")

// Get All Members
exports.getAllMembers=(request,response,next)=>{
    MemberSchema.find({})
    .then(data=>{
        response.status(200).json({data})
    })
    .catch(error=>next(error))
}

// Add Member
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
    }).save() 
    .then(data=>{
     response.status(201).json({data});

    })
    .catch(error=>next(error))
}

// Update Member
exports.updateMember=async (request,response,next)=>{
   
    const memberOldData=await MemberSchema.findOne({_id:request.body.id},{image:1,password:1,_id:0})
    let hashUPassword=memberOldData.password;
    // Hash New Password
    if(request.body.password)
    {
        hashUPassword= bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(saltRounds));
    }
    // Update Data
    MemberSchema.updateOne({
        _id:request.body.id
    },{
        $set:{
            fullName:request.body.name,
            password:hashUPassword ,
            phoneNumber:request.body.phoneNumber,
            birthdate:request.body.birthdate,
            city:request.body.city,
            street:request.body.street,
            building:request.body.building,
            image:request.file?.path ?  request.file.path :  memberOldData.image
        }
    }).then(data=>{
        if(data.matchedCount!=1)
            next(new Error("Member not found"));    
        else{
            // Delete Old Image
            if(request.file)
            {
                const imagePath=memberOldData.image;
                fs.unlinkSync(imagePath);
            }
            response.status(200).json({data:"updated"});
        }
    })
    .catch(error=>next(error))
}

// Delete Member
exports.deleteMember=async (request,response,next)=>{
    try{
        let memberData=await MemberSchema.findOne({_id:request.body.id},{image:1,_id:0})
        if(memberData)
        {
            const pathToImg = memberData.image;
            fs.unlinkSync(pathToImg);
        }
        MemberSchema.deleteOne({
            _id:request.body.id
        }).then(data=>{
            if(data.deletedCount==0)
                next(new Error("Member not found"));
            else
                response.status(200).json({data:"deleted"});
        })
    }
    catch(error){next(error)}
}