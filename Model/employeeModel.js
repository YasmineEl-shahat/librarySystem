const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema({
  _id: Number,
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String, required: true },
  salary: { type: Number, required: true },
  birthdate: { type: Date, required: true },
  hiredate: { type: Date, required: true },
  image: String,
});

schema.plugin(AutoIncrement);
mongoose.model("employees", schema);
