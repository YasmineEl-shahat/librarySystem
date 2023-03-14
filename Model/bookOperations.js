const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const books = mongoose.model("books");
const members = mongoose.model("members");
const employees = mongoose.model("employees");

const bookOperationsSchema = new mongoose.Schema(
  {
    _id: Number,
    bookId: {
      type: Number,
      ref: books,
      required: [true, "Book Id is required"],
    },
    memberId: {
      type: Number,
      ref: members,
      required: [true, "Member Id is required"],
    },
    employeeId: {
      type: Number,
      ref: employees,
      required: [true, "Employee Id is required"],
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
  },
  {
    timestamps: true,
  }
);

bookOperationsSchema.plugin(AutoIncrement, { id: "bookOperation_id", inc_field: "_id" });
mongoose.model("bookOperations", bookOperationsSchema);
