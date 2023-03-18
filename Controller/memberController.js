const mongoose = require("mongoose");
require("./../Model/memberModel");
const comparePassword = require("../helpers/comparePassword");
// Encryot password
const MemberSchema = mongoose.model("members");
// Delete Image
const genHashedPassword = require("../helpers/genHashedPassword");
const fs = require("fs");
const Mail = require("./mailController");
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
      Mail(data.email, "newMe12_");
      response.status(201).json({ data });
    })
    .catch((error) => next(error));
};

exports.updateMember = async (request, response, next) => {
  if (request.role == "member") {
    delete request.body.email;
  }
  try {
    const memberOldData = await MemberSchema.findOne(
      { _id: request.params.id },
      { image: 1, password: 1, _id: 0 }
    );
    if (!memberOldData) {
      throw new Error("Member not found");
    }
    //  first time login admin update to image
    if (
      (memberOldData.image == undefined && request.file) ||
      (await comparePassword("newMe12_", memberOldData.password))
    ) {
      throw new Error(
        "You Can Not Update Image OR Password Before Member First Login"
      );
    }
    let hashUPassword = memberOldData.password;
    // Hash New Password
    if (request.body.password) {
      hashUPassword = genHashedPassword(request.body.password);
    }
    // Update Data
    MemberSchema.updateOne(
      {
        _id: request.params.id,
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
    let member = await MemberSchema.findOne(
      { _id: request.params.id },
      { image: 1, _id: 0 }
    );
    if (!member) next(new Error("Member not found"));
    else {
      if (member?.image) {
        const pathToImg = member.image;
        fs.unlinkSync(pathToImg);
      }
      MemberSchema.deleteOne({
        _id: request.params.id,
      }).then((data) => {
        if (data.deletedCount == 0) {
          next(new Error("Member not found"));
        } else response.status(200).json({ data: "deleted" });
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.autoComplete = (req, res, next) => {
  const data = "^" + req.params.data.trim();
  MemberSchema.find(
    {
      $or: [
        { email: { $regex: data, $options: "ix" } },
        { fullName: { $regex: data, $options: "i" } },
      ],
    },
    { fullName: 1, email: 1, _id: 0 }
  )
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      next(err);
    });
};

//END of Basic Functions

//////////////nabila///////////////
exports.memberSearch = (request, response, error) => {
  // console.log(request.query)
  let searchQuery = { ...request.query };
  let searchProperty = ["fullName", "email"];
  searchProperty.forEach((el) => {
    if (searchQuery[el]) {
    } else {
      delete searchQuery[el];
    }
  });
  console.log(searchQuery);
  MemberSchema.find(searchQuery)
    .limit(5)
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};
