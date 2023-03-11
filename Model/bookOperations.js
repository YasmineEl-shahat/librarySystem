const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
// const books = require("./bookModel");
// const employees = require("./employeeModel");

const bookOperationsSchema = new mongoose.Schema({
    bookId: { type: Number, ref: books, required: [true, "Book Id is required"] },
    memberId: {
      type: Number,
      ref: members,
      required: [true, "Member Id is required"],
    },
    empId: {
      type: Number,
      ref: employees,
      required: [true, "Employee Id is required"],
    },
    startDate: {
      type: Date,
      default: Date.now(),
      required: [true, "Start Date is required"],
    },
    deadlineDate: {
      type: Date,
      required: [true, "Deadline Date Id is required"],
    },
    returnDate: { type: Date },
    type: {
      type: String,
      enum: ["read", "borrow"],
      required: [true, "Value must be read OR borrow"],
    },
    return: { type: Boolean, default: false },
  });

  
mongoose.model("bookOperations", bookOperationsSchema);