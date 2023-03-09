const mongoose = require("mongoose");
require("./../Model/bookModel");
const bookSchema = mongoose.model("books");
require("./../Model/bookModel");
const employeeSchema = mongoose.model("employees");
require("./../Model/employeeModel");
const memberSchema = mongoose.model("members");
const fs = require("fs")


//get all books
exports.getAllBooks=(request,response,next)=>{
    bookSchema.find({})
    .then(data=>{
        response.status(200).json({data})
    })
    .catch(error=>next(error))
}


  //add book
  exports.addBook = (request, response, next) => {
    if(request.body.avilable!=request.body.numOfCopies)
        next(new Error("Number of available books must equal Number of copies"));
    new bookSchema({
      _id: request.body.id,
      title: request.body.title,
      auther: request.body.auther,
      publisher: request.body.publisher,
      publishingDate: request.body.publishingDate,
      category: request.body.category,
      edition: request.body.edition,
      pages: request.body.pages,
      image: request.file?.path ? request.file.path : "",
      avilable: request.body.avilable,
      numOfCopies: request.body.numOfCopies,
      shelfNo: request.body.shelfNo,
    })
      .save()
      .then((data) => response.status(201).json({ data }))
      .catch((error) => next(error));
  };

//edit book
exports.updateBook=async (request,response,next)=>{
    try{ 

        let imagePath=await bookSchema.findOne({_id:request.body.id},{image:1,_id:0})
        console.log("path: " , imagePath.image)
        if(imagePath)
        {
            const pathToImg = imagePath.image;
            fs.unlinkSync(pathToImg);
        }
        else{
            console.log("image not found")
        }

        let bookData = await bookSchema.updateOne({
            _id:request.body.id
        },{
            $set:{
                title: request.body.title,
                auther: request.body.auther,
                publisher: request.body.publisher,
                publishingDate: request.body.publishingDate,
                category: request.body.category,
                edition: request.body.edition,
                pages: request.body.pages,
                image: request.file?.path ? request.file.path : bookData.image,
                avilable: request.body.avilable,
                numOfCopies: request.body.numOfCopies,
                shelfNo: request.body.shelfNo,
            }
        }).then(data=>{
            if(data.matchedCount==0)
                next(new Error("Book not found"));
            else
                response.status(200).json({data:"updated"});
        })
    }
    catch(error){
        next(error)
    }
}

//delete book
exports.deleteBook=async (request,response,next)=>{
    try{
        let imagePath=await bookSchema.findOne({_id: request.params.id},{image:1,_id:0})
        if(imagePath)
        {
            const pathToImg = imagePath.image;
            fs.unlinkSync(pathToImg);
        }
        bookSchema.deleteOne({
            _id: request.params.id
        }).then(data=>{
            if(data.deletedCount==0)
            {
                next(new Error("book not found"));
            }
            else
                response.status(200).json({data:"deleted"});
                console.log(data)
        })
    }
    catch(error){
        next(error)
    }
}

// Get New Arrived Books
exports.getNewBooks=(request,response,next)=>{
    let beforeMonth = new Date();
    beforeMonth.setMonth(beforeMonth.getMonth() - 1);
    bookSchema.find({
        createdAt: { $gte: beforeMonth }
    })
    .then(data=>{
        response.status(200).json({data})
    })
    .catch(error=>next(error))
}

exports.borrowBooks =async(request,response,next)=>{

    let book = await bookSchema.findOne({_id:request.query.book_id},{avilable:1,numOfCopies:1,_id:0})
    console.log(request.query.member_id,request.query.book_id,"book not found++++++++")
    if(book == null) next(new Error("book not found"))
    else{
        // console.log(book.avilable,book.numOfCopies)
        if(book.avilable  <= book.numOfCopies && book.avilable > 1  ){
            try{
            let bookUpate= await bookSchema.updateOne(  {_id:request.query.book_id},  {  $inc:{avilable:-1}  } )

            let memberUpate =await memberSchema.updateOne(
                    {_id:request.query.member_id},
                    {
                        $push:{
                            borrowedBooks:{ 
                                deadlineDate:addDays( new Date(Date.now()),7),
                                bookId: request.query.book_id,
                                empId: request.id,
                                return:false,
                                // numOfBorrowed:0,
                                // $inc:{  numOfBorrowed:2},
                            },
                            // $inc:{`borrowedBooks.$.${numOfBorrowed}` :1},
                        }, 
                    }
                )
                    response.status(200).json({message:"you borrow book"})
                }catch(error) {
                    next(error)
                }
        }
        else  next(new Error("book not avilable"))
    }

}//borrow


function addDays(date, days) {
    console.log(date)
    date.setDate(date.getDate() + days);

    console.log(date)
    return date;
  }