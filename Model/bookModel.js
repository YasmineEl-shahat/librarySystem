const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema({
  _id: Number,
  title: { type: String, required: true },
  auther: { type: String, required: true },
  publisher: {type: String, required: true,},
  publishingDate: { type: Date, required: true },
  category: { type: String, required: true },
  edition: { type: Number, required: true },
  pages: { type: Number, required: true },
  image: {type:String,required:true},
  avilable:{type:Number,required:true},
  numOfCopies:{type:Number,required:true},
  shelfNo:{type:Number,required:true},
  noOfBorrowing:{type:Number,required:true,default:0},
  noOfReading:{type:Number,required:true,default:0},
},{
  timestamps:true
});

schema.plugin(AutoIncrement,{id :"book_id" , inc_field:"_id"});
mongoose.model("books", schema);