const mongoose = require("mongoose");
require("./../Model/bookOperations");
const memberSchema = mongoose.model("members");
const bookSchema = mongoose.model("books");
const bookOperation = mongoose.model("bookOperations");
const fs = require("fs");

//get all books
exports.getAllBookOperation = (request, response, next) => {
  bookOperation
    .find({})
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

//get borrowed books
exports.getBorrowedBook = (request, response, next) => {
  bookOperation
    .find({ type: "borrow" })
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};
//get reading books
exports.getReadingBook = (request, response, next) => {
  bookOperation
    .find({ type: "read" })
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};
// borrow book operation
exports.borrowBooks = async (request, response, next) => {
  let book = await bookSchema.findOne(
    { _id: request.body.book_id },
    { avilable: 1, _id: 0 }
  );
  let member = await memberSchema.findOne(
    { _id: request.body.member_id },
    { blockedDate: 1, borrowedBooks: 1, _id: 0 }
  );
  let operation = await bookOperation.findOne(
    {
      memberId: request.body.member_id,
      bookId: request.body.book_id,
      return: false,
    },
    { return: 1, _id: 0 }
  );
  if (book == null) next(new Error("book not found"));
  if (member == null) next(new Error("member not found"));
  else {
    if (
      book.avilable > 1 &&
      (member.blockedDate < new Date(Date.now()) ||
        member.blockedDate == undefined) &&
      (operation?.return == true || operation == null)
    ) {
      try {
        await bookSchema.updateOne(
          { _id: request.body.book_id },
          { $inc: { avilable: -1, noOfBorrowing: 1 } }
        );
        let borrowedBefore =
          member.borrowedBooks.indexOf(request.body.book_id) == -1;
        if (borrowedBefore) {
          await memberSchema.updateOne(
            { _id: request.body.member_id },
            {
              $push: {
                borrowedBooks: request.body.book_id,
              },
            }
          );
        }
        new bookOperation({
          bookId: request.body.book_id,
          memberId: request.body.member_id,
          employeeId: request.id,
          deadlineDate: request.body.deadlineDate,
          type: "borrow",
        }).save();
        response.status(200).json({ message: "you borrow book" });
      } catch (error) {
        next(error);
      }
    } else next(new Error("you can't borrow book"));
  }
}; //borrow

// List Of Borrowed Book
exports.borrowBooksList = async (request, response, next) => {
  const memberData = await memberSchema.findOne({ id: request.id });
  if (!memberData) next(new Error("Member not found"));
  const today = new Date();
  let year = request.query?.year ? request.query.year : today.getFullYear();
  let month = request.query?.month ? request.query.month : today.getMonth() + 1;

  await bookOperation
    .aggregate([
      {
        $project: {
          _id: 0,
          bookId: 1,
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
      },
      {
        $match: {
          id: request.id,
          return: false,
          year: year,
          month: month,
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
  let member = await memberSchema.findOne(
    { _id: member_id },
    { blockedDate: 1, readingBooks: 1, _id: 0 }
  );
  let operation = await bookOperation.findOne(
    {
      memberId: member_id,
      bookId: book_id,
      return: false,
    },
    { return: 1, _id: 0 }
  );
  if (book == null) next(new Error("book not found"));
  else if (member == null) next(new Error("member not found"));
  else {
    if (
      book.avilable > 1 &&
      (member.blockedDate < new Date(Date.now()) ||
        member.blockedDate == undefined) &&
      (operation?.return == true || operation == null)
    ) {
      try {
        await bookSchema.updateOne(
          { _id: book_id },
          { $inc: { avilable: -1, noOfReading: 1 } }
        );
        await new bookOperation({
          bookId: book_id,
          memberId: member_id,
          employeeId: request.id,
          deadlineDate: addDays(new Date(Date.now()), 1),
          type: "read",
          return: false,
        }).save();
        let readedBefore = member.readingBooks.indexOf(book_id) != -1;

        if (!readedBefore) {
          await memberSchema.updateOne(
            { _id: member_id },
            {
              $push: {
                readingBooks: book_id,
              },
            }
          );
        }
        response
          .status(200)
          .json({ message: "reading operation completed successfully" });
      } catch (error) {
        next(error);
      }
    } else next(new Error("reading operation refused"));
  }
};
