const mongoose = require("mongoose");
require("./../Model/memberModel");
require("./../Model/bookModel");
const MemberSchema = mongoose.model("members");
const bookSchema = mongoose.model("books");

exports.getMemberByName = (request, response, error) => {
  MemberSchema.find({ name: request.params.name })
    .limit(5)
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

exports.getMemberByEmail = (request, response, error) => {
  MemberSchema.find({ email: request.params.email })
    .limit(5)
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

exports.bookAuther = (request, response, error) => {
  bookSchema
    .find(
      { auther: request.params.auther },
      { avilable: 1, numOfCopies: 1, title: 1 }
    )
    .limit(5)
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

exports.bookPuplisher = (request, response, error) => {
  bookSchema
    .find(
      { publisher: request.params.publisher },
      { avilable: 1, numOfCopies: 1, title: 1 }
    )
    .limit(5)
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

exports.bookTitle = (request, response, error) => {
  bookSchema
    .find(
      { title: request.params.title },
      { avilable: 1, numOfCopies: 1, title: 1 }
    )
    .limit(5)
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};
