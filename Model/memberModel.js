const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const books = require("./bookModel");
const employees = require("./employeeModel");

const memberSchema = new mongoose.Schema(
  {
    _id: Number,
    fullName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, " Invalid Email"],
    },
    password: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^01[0125][0-9]{8}$/, "Invalid phoneNumber"],
    },
    birthdate: { type: Date, required: true },
    fullAddress: {
      type: Object,
      city: { type: String, required: true },
      street: { type: String, required: true },
      building: { type: String, required: true },
    },
    image: { type: String, required: [ true, "IMAGE IS RQUIRED"] },
    blockedDate: { type: Date },
    readingBooks: {
      type: Array,
      items: {
        type: Number,
        ref: books,
      },
    },
    borrowedBooks: {
      type: Array,
      items: {
        type: Number,
        ref: books,
      },
    },
  },
  {
    timestamps: true,
  }
);

memberSchema.plugin(AutoIncrement, { id: "member_id", inc_field: "_id" });
mongoose.model("members", memberSchema);
