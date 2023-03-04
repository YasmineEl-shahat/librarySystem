const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema({
  _id: Number,
  fullName: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, " invalid Email"],
  },
  password: { type: String, required: true },
  phoneNumber: {
      type: String,
      required: true,
      match: [/^01[0125][0-9]{8}$/, "invalid phoneNumber"],
    },
  birthdate: { type: Date, required: true },
  fullAddress: { city:String,street:String,building:Number },
  // createdAt:{type:Date.now(),required:true},
  image: String,
},
// {
//   _id: false 
// },
{
  timestamps:true
});

// schema.plugin(AutoIncrement);
mongoose.model("members", schema);