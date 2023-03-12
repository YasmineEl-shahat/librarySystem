// const {request,response}=require('express');
const mongoose = require("mongoose");
require("./../Model/memberModel");
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
  let hashPassword = genHashedPassword(request.body.password);
  if (!request.file) throw new Error("Image Is Required");
  new MemberSchema({
    _id: request.body.id,
    fullName: request.body.name,
    email: request.body.email,
    password: hashPassword,
    phoneNumber: request.body.phoneNumber,
    birthdate: request.body.birthdate,
    city: request.body.city,
    street: request.body.street,
    building: request.body.building,
    image: request.file.path,
  })
    .save()
    .then((data) => {
      response.status(201).json({ data });
    })
    .catch((error) => next(error));
};

exports.updateMember = async (request, response, next) => {
  const memberOldData = await MemberSchema.findOne(
    { _id: request.body.id },
    { image: 1, password: 1, _id: 0 }
  );
  if (!memberOldData) next(new Error("Member not found"));
  else {
    let hashUPassword = memberOldData.password;
    // Hash New Password
    if (request.body.password)
      hashUPassword = genHashedPassword(request.body.password);
    // Update Data
    if (request.role != "badmin") {
      delete request.body.email;
    }
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
          city: request.body.city,
          street: request.body.street,
          building: request.body.building,
          image: request.file?.path ? request.file.path : memberOldData.image,
        },
      }
    )
      .then((data) => {
        // Delete Old Image
        if (request.file) {
          const imagePath = memberOldData.image;
          fs.unlinkSync(imagePath);
        }
        response.status(200).json({ data: "updated" });
      })
      .catch((error) => next(error));
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
