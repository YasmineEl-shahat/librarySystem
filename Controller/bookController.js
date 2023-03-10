const mongoose = require("mongoose");
require("./../Model/bookModel");
const bookSchema = mongoose.model("books");
require("./../Model/bookModel");
const employeeSchema = mongoose.model("employees");
require("./../Model/employeeModel");
const memberSchema = mongoose.model("members");
const fs = require("fs")

//get all books
exports.getAllBooks = (request, response, next) => {
  bookSchema
    .find({})
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//add book
exports.addBook = (request, response, next) => {
  if (request.body.avilable != request.body.numOfCopies)
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
exports.updateBook = async (request, response, next) => {
  try {
    let imagePath = await bookSchema.findOne(
      { _id: request.body.id },
      { image: 1, _id: 0 }
    );
    console.log("path: ", imagePath.image);
    if (imagePath) {
      const pathToImg = imagePath.image;
      fs.unlinkSync(pathToImg);
    } else {
      console.log("image not found");
    }

    let bookData = await bookSchema
      .updateOne(
        {
          _id: request.body.id,
        },
        {
          $set: {
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
          },
        }
      )
      .then((data) => {
        if (data.matchedCount == 0) next(new Error("Book not found"));
        else response.status(200).json({ data: "updated" });
      });
  } catch (error) {
    next(error);
  }
};

//delete book
exports.deleteBook = async (request, response, next) => {
  try {
    let imagePath = await bookSchema.findOne(
      { _id: request.params.id },
      { image: 1, _id: 0 }
    );
    if (imagePath) {
      const pathToImg = imagePath.image;
      fs.unlinkSync(pathToImg);
    }
    bookSchema
      .deleteOne({
        _id: request.params.id,
      })
      .then((data) => {
        if (data.deletedCount == 0) {
          next(new Error("book not found"));
        } else response.status(200).json({ data: "deleted" });
        console.log(data);
      });
  } catch (error) {
    next(error);
  }
};

// Get New Arrived Books
exports.getNewBooks = (request, response, next) => {
  let beforeMonth = new Date();
  beforeMonth.setMonth(beforeMonth.getMonth() - 1);
  bookSchema
    .find({
      createdAt: { $gte: beforeMonth },
    })
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

function addDays(date, days) {
    console.log(date)
    date.setDate(date.getDate() + days);

    console.log(date)
    return date;
  }
// Get Books within specific Year
exports.getBooksYear = (request, response, next) => {
  console.log(typeof Number(request.params.year));
  const y = Number(request.params.year);
  bookSchema
    .aggregate([
      {
        $project: {
          _id: 0,
          title: 1,
          publishingDate: {
            $year: "$publishingDate",
          },
        },
      },
      { $match: { publishingDate: y } },
    ])
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};
