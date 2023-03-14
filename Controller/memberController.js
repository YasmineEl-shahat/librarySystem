// const {request,response}=require('express');
const mongoose = require("mongoose");
require("./../Model/memberModel");
const comparePassword = require("../helpers/comparePassword");
// Encryot password
const MemberSchema = mongoose.model("members");
// Delete Image
const genHashedPassword = require("../helpers/genHashedPassword");
const fs = require("fs");
// const uploadImage = require("../helpers/deletingImages");

exports.getAllMembers = (request, response, next) => {
  MemberSchema.find({})
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

exports.getMember = (request, response, next) => {
  MemberSchema.find({ _id: request.params.id })
    .then((data) => {
      if (data.length == 0) next(new Error("Member not found"));
      else response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

// Get Member By ID
exports.getMember = (request, response, next) => {
  MemberSchema.find({ _id: request.params.id })
    .then((data) => {
      console.log(data);
      if (data.length == 1) response.status(200).json({ data });
      else next(new Error("Member not found"));
    })
    .catch((error) => next(error));
};

exports.addMember = (request, response, next) => {
  new MemberSchema({
    _id: request.body.id,
    fullName: request.body.name,
    email: request.body.email,
    phoneNumber: request.body.phoneNumber,
    birthdate: request.body.birthdate,
    "fullAddress.city": request.body.city,
    "fullAddress.street": request.body.street,
    "fullAddress.building": request.body.building,
  })
    .save()
    .then((data) => {
      response.status(201).json({ data });
    })
    .catch((error) => next(error));
};

exports.updateMember = async (request, response, next) => {
  if (request.role != "badmin") {
    delete request.body.email;
  }
  try {
    const memberOldData = await MemberSchema.findOne(
      { _id: request.body.id },
      { image: 1, password: 1, _id: 0 }
    );
    console.log(memberOldData.image);
    if (!memberOldData) {throw new Error("Member not found");}
    //  first time login admin update to image
    if ((memberOldData.image == undefined  && request.file ) || await comparePassword("newMe12_",memberOldData.password) )
     {
      console.log("+++");
      // next(new Error("You Can Not Update Image OR Password Before Member First Login"))
      throw new Error(
        "You Can Not Update Image OR Password Before Member First Login"
      );
    }
    let hashUPassword = memberOldData.password;
    // Hash New Password
    if (request.body.password){
      hashUPassword = genHashedPassword(request.body.password);
    }
    // Update Data
    MemberSchema.updateOne(
      {
        _id: request.body.id,
      },
      {
        $set: {
          fullName: request.body.name,
          password: hashUPassword,
          phoneNumber: request.body.phoneNumber,
          birthdate: request.body.birthdate,
          email: request.body.email,
          "fullAddress.city": request.body.city,
          "fullAddress.street": request.body.street,
          "fullAddress.building": request.body.building,
          image: request.file?.path ? request.file.path : memberOldData.image,
        },
      }
    )
      .then((data) => {
        // Delete Old Image
        if (request.file) {
          // const path = memberOldData.image;
          // fs.unlinkSync(path);
        }
        response.status(200).json({ data: "updated" });
      })
      .catch((error) => next(error));
  } catch (error) {
    next(error);
  }
};
exports.deleteMember = async (request, response, next) => {
  try {
    let imagePath = await MemberSchema.findOne(
      { _id: request.params.id },
      { image: 1, _id: 0 }
    );
    if (!imagePath) next(new Error("Member not found"));
    else {
      console.log(`image path` + imagePath.image);
      if (imagePath) {
        const pathToImg = imagePath.image;
        fs.unlinkSync(pathToImg);
      } else {
        console.log("image not found");
      }
      MemberSchema.deleteOne({
        _id: request.params.id,
      }).then((data) => {
        if (data.deletedCount == 0) {
          next(new Error("Member not found"));
        } else response.status(200).json({ data: "deleted" });
        console.log(data);
      });
    }
  } catch (error) {
    next(error);
  }
};

//END of Basic Functions
