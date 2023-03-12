const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");
const saltRounds = 10;
hash = bcrypt.hashSync("newEmp12_", saltRounds);


const schema = new mongoose.Schema({
  _id: Number,
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: [true,"EMAIL IS REQUIRED"],
    match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, " invalid Email"],
  },
  isBase: { type: Boolean },
  password: { type: String, default: hash },
  salary: { type: Number, required: [true, "SALARY IS REQUIRED"] },
  birthdate: { type: Date, required: [true, "BIRTHDATE IS REQUIRED "] },
  hiredate: { type: Date, required: [true, "HIREDATE IS REQUIRED"] },
  image: String,
});

schema.plugin(AutoIncrement, { id: "employee_id", inc_field: "_id" });
mongoose.model("employees", schema);
