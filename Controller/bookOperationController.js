const mongoose = require("mongoose");
require("./../Model/bookOperations");
const memberSchema = mongoose.model("members");
const bookSchema = mongoose.model("books");
const bookOperation = mongoose.model("bookOperations");
const fs = require("fs")

// exports.borrowBooks =async(request,response,next)=>{

//     let book = await bookSchema.findOne({_id:request.query.book_id},{avilable:1,numOfCopies:1,_id:0})
//     console.log(request.query.member_id,request.query.book_id,"book not found++++++++")
//     if(book == null) next(new Error("book not found"))
//     else{
//         // console.log(book.avilable,book.numOfCopies)
//         if(book.avilable  <= book.numOfCopies && book.avilable > 1  ){
//             try{
//             let bookUpate= await bookSchema.updateOne(  {_id:request.query.book_id},  {  $inc:{avilable:-1}  } )

//             let memberUpate =await memberSchema.updateOne(
//                     {_id:request.query.member_id},
//                     {
//                         $push:{
//                             borrowedBooks:{ 
//                                 deadlineDate:addDays( new Date(Date.now()),7),
//                                 bookId: request.query.book_id,
//                                 empId: request.id,
//                                 return:false,
//                                 // numOfBorrowed:0,
//                                 // $inc:{  numOfBorrowed:2},
//                             },
//                             // $inc:{`borrowedBooks.$.${numOfBorrowed}` :1},
//                         }, 
//                     }
//                 )
//                     response.status(200).json({message:"you borrow book"})
//                 }catch(error) {
//                     next(error)
//                 }
//         }
//         else  next(new Error("book not avilable"))
//     }

// }//borrow


// List Of Borrowed Book 
exports.borrowBooksList= async (request,response,next)=>{
    const memberData=await memberSchema.findOne({id:request.id});
    if(!memberData) next(new Error("Member not found"));

    await bookOperation.find({id:request.id},{
        bookId:1,_id:0
    })
  //request.query?.year
  //request.query?.month
//   bookSchema
//     .aggregate([
//       {
//         $project: {
//           _id: 0,
//           title: 1,
//           publishingDate: {
//             $year: "$publishingDate",
//           },
//         },
//       },
//       { $match: { publishingDate: y } },
//     ])
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));

}