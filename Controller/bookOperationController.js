const mongoose = require("mongoose");
require("./../Model/bookOperations");
const memberSchema = mongoose.model("members");
const bookSchema = mongoose.model("books");
const bookOperation = mongoose.model("bookOperations");
const fs = require("fs");
const path = require("path");

// exports.borrowBooks = async (request, response, next) => {
//   let book = await bookSchema.findOne(
//     { _id: request.query.book_id },
//     { avilable: 1, numOfCopies: 1, _id: 0 }
//   );
//   console.log(
//     request.query.member_id,
//     request.query.book_id,
//     "book not found++++++++"
//   );
//   if (book == null) next(new Error("book not found"));
//   else {
//     // console.log(book.avilable,book.numOfCopies)
//     if (book.avilable <= book.numOfCopies && book.avilable > 1) {
//       try {
//         let bookUpate = await bookSchema.updateOne(
//           { _id: request.query.book_id },
//           { $inc: { avilable: -1 } }
//         );

//         let memberUpate = await memberSchema.updateOne(
//           { _id: request.query.member_id },
//           {
//             $push: {
//               borrowedBooks: {
//                 deadlineDate: addDays(new Date(Date.now()), 7),
//                 bookId: request.query.book_id,
//                 empId: request.id,
//                 return: false,
//                 // numOfBorrowed:0,
//                 // $inc:{  numOfBorrowed:2},
//               },
//               // $inc:{`borrowedBooks.$.${numOfBorrowed}` :1},
//             },
//           }
//         );
//         response.status(200).json({ message: "you borrow book" });
//       } catch (error) {
//         next(error);
//       }
//     } else next(new Error("book not avilable"));
//   }
// }; //borrow

// List Of Borrowed Book
exports.borrowBooksList = async (request, response, next) => {
  const memberData = await memberSchema.findOne({ _id: request.query.id });
  if (!memberData) next(new Error("Member not found"));
  const today = new Date();
  let yearValue = request.query?.year
    ? request.query.year
    : today.getFullYear();
  let monthValue = request.query?.month
    ? request.query.month
    : today.getMonth() + 1;

  await bookOperation
    .aggregate([
      {
        $project: {
          _id: 0,
          bookId: 1,
          memberId: 1,
          type: 1,
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $match: {
          memberId: Number(request.query.id),
          year: yearValue,
          month: monthValue,
          type: "borrow",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $project: {
          _id: 0,
          bookTitle: "$book.title",
        },
      },
    ])
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//give books for reading
exports.readBook = async (request, response, next) => {
  const book_id = request.query.book_id;
  const member_id = request.query.member_id;
  let book = await bookSchema.findOne(
    { _id: book_id },
    { avilable: 1, numOfCopies: 1, _id: 0 }
  );
  if (book == null) next(new Error("book not found"));
  else {
    if (book.avilable <= book.numOfCopies && book.avilable > 1) {
      try {
        let bookUpate = await bookSchema.updateOne(
          { _id: book_id },
          { $inc: { avilable: -1, noOfReading: 1 } }
        );
        let memberData = await memberSchema.findOne({ _id: member_id });
        let readedBefore = memberData.readingBooks.indexOf(book_id) != -1;
        if (memberData.blockedDate <= new Date(Date.now())) {
          if (!readedBefore) {
            let memberUpate = await memberSchema.updateOne(
              { _id: member_id },
              {
                $push: {
                  readingBooks: book_id,
                },
              }
            );
          }
          let bookOperationUpdate = await new bookOperation({
            bookId: book_id,
            memberId: member_id,
            employeeId: request.id,
            deadlineDate: addDays(new Date(Date.now()), 1),
            type: "read",
            return: false,
          }).save();
          response.status(200).json({ message: "book taken for read" });
        } else throw new Error("you 're blocked from reading or borrowing");
      } catch (error) {
        next(error);
      }
    } else next(new Error("book not avilable"));
  }
};

// List Of Reading Book
exports.readBooksList = async (request, response, next) => {
  const memberData = await memberSchema.findOne({ _id: request.query.id });
  if (!memberData) next(new Error("Member not found"));
  const today = new Date();
  let yearValue = request.query?.year
    ? request.query.year
    : today.getFullYear();
  let monthValue = request.query?.month
    ? request.query.month
    : today.getMonth() + 1;

  await bookOperation
    .aggregate([
      {
        $project: {
          _id: 0,
          bookId: 1,
          memberId: 1,
          type:1,
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $match: {
          memberId: Number(request.query.id),
          year: yearValue,
          month: monthValue,
          type: "read",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $project: {
          _id: 0,
          bookTitle: "$book.title",
        },
      },
    ])
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};
