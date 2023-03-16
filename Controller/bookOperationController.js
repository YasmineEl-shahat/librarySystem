const mongoose = require("mongoose");
require("./../Model/bookOperations");
const memberSchema = mongoose.model("members");
const bookSchema = mongoose.model("books");
const bookOperation = mongoose.model("bookOperations");
const fs = require("fs");
const addDays = require("../helpers/addDays");
const path = require("path");

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
  const memberData = await memberSchema.findOne({ _id: request.query.id });
  if (!memberData) next(new Error("Member not found"));
  const today = new Date();
  let yearValue = request.query?.year
    ? request.query.year
    : today.getFullYear();
  let monthValue = request.query?.month
    ? request.query.month
    : today.getMonth() + 1;

  bookOperation
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

// return book
exports.returnBook = async (request, response, next) => {
  const book_id = request.query.book_id;
  const member_id = request.query.member_id;
  let book = await bookSchema.findOne(
    { _id: book_id },
    { avilable: 1, _id: 0 }
  );
  let member = await memberSchema.findOne(
    { _id: member_id },
    { blockedDate: 1, _id: 0 }
  );
  let operation = await bookOperation.findOne(
    {
      memberId: member_id,
      bookId: book_id,
      return: false,
    },
    { return: 1, deadlineDate: 1, _id: 0 }
  );

  if (book == null) next(new Error("book not found"));
  else if (member == null) next(new Error("member not found"));
  else if (operation == null)
    next(new Error("This member didn't take this book before"));
  else {
    try {
      if (operation?.deadlineDate < new Date(Date.now())) {
        await memberSchema.updateOne(
          { _id: member_id },
          {
            $set: {
              blockedDate:
                member.blockedDate == undefined ||
                member.blockedDate < new Date(Date.now())
                  ? addDays(new Date(Date.now()), 7)
                  : addDays(member.blockedDate, 7),
            },
          }
        );
      }
      await bookSchema.updateOne({ _id: book_id }, { $inc: { avilable: 1 } });
      await bookOperation.updateOne(
        {
          bookId: book_id,
          memberId: member_id,
          return: false,
        },
        { $set: { return: true, returnDate: new Date(Date.now()) } }
      );
      response
        .status(200)
        .json({ message: "return operation completed successfully" });
    } catch (error) {
      next(error);
    }
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

  bookOperation
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
exports.searchBorrowedBook = (request, response, next) => {
  bookOperation
    .aggregate([
      {
        $project: {
          employeeId: 1,
          memberId: 1,
          bookId: 1,
          return: 1,
          type: 1,
          _id: 0,
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "emp",
        },
      },
      { $unwind: "$emp" },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "member",
        },
      },
      { $unwind: "$member" },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      { $match: { return: false, type: "borrow" } },
      {
        $project: {
          employeeName: "$emp.fname",
          memberName: "$member.fullName",
          bookName: "$book.title",
        },
      },
    ])
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};
