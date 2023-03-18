const mongoose = require("mongoose");
require("./../Model/bookModel");
const bookSchema = mongoose.model("books");
require("./../Model/bookModel");
const employeeSchema = mongoose.model("employees");
require("./../Model/employeeModel");
const memberSchema = mongoose.model("members");
const fs = require("fs");

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
    if (!imagePath) next(new Error("Book not found"));
    if (imagePath) {
      const pathToImg = imagePath.image;
      fs.unlinkSync(pathToImg);
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
      });
  } catch (error) {
    next(error);
  }
};

// Get New Arrived Books
exports.getNewBooks = (request, response, next) => {
  let date = new Date();
  date.setDate(date.getDate() - 7);
  bookSchema
    .find(
      {
        createdAt: { $gte: date },
      },
      {
        _id: 0,
        title: 1,
        auther: 1,
      }
    )
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

// Get Books within specific Year (filter by year)
exports.getBooksYear = (request, response, next) => {
  const today = new Date();
  let yearValue = request.query?.year
    ? Number(request.query.year)
    : today.getFullYear();
  bookSchema
    .aggregate([
      {
        $project: {
          _id: 0,
          title: 1,
          arriveDate: {
            $year: "$createdAt",
          },
        },
      },
      { $match: { arriveDate: yearValue } },
    ])
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

////////////////nabila////////////////
exports.bookSearch = (request, response, error) => {
  // console.log(request.query);
  let searchQuery = { ...request.query };
  let searchProperty = ["auther", "publisher", "title"];
  searchProperty.forEach((el) => {
    if (searchQuery[el]) {
    } else {
      delete searchQuery[el];
    }
  });
  // console.log(searchQuery);
  bookSchema
    .find(searchQuery, { avilable: 1, numOfCopies: 1, noOfBorrowing: 1 })
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};
// Get Books Filtered By Year
exports.groupBooksByYear = (request, response, next) => {
  bookSchema
    .aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$publishingDate" },
          },
          ListOfNames: { $push: { Name: "$title", Author: "$auther" } },
        },
      },
    ])
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};

exports.availableBook = (request, response, next) => {
  bookSchema
    .find({ avilable: { $gt: 1 } }, { title: 1, avilable: 1, _id: 0 })
    .then((data) => {
      response.status(200).json({ data });
    })
    .catch((error) => next(error));
};
exports.bookSearchFilter = async (request, response, next) => {
  try {
    console.log(request.query);
    let allBooks = await bookSchema.aggregate([
      {
        $project: {
          _id: 1,
          title: 1,
          publishingDate: {
            $year: "$publishingDate",
          },
          publisher: 1,
          category: 1,
          author: 1,
          avilable: { $gt: ["avilable", 1] },
        },
      },
    ]);

    const filters = request.query;
    let res = allBooks.filter((book) => {
      let isValid = true;
      for (key in filters) {
        isValid = isValid && book[key] == filters[key];
      }
      return isValid;
    });
    response.send(res);
  } catch (error) {
    response.status(500).send();
  }
};

// exports.bookSearchFilter = (request, response, next) => {
//   const match = {...request.query}
//   console.log(match);
//      if(request.query.year){
//        const year = Number(request.query.year);
//        match.year=year;
//    }
//     if(request.query.category){
//       match.category=category;
//     }

//   bookSchema.aggregate([
//     {
//       $project: {
//         _id: 1,
//         title: 1,
//         publishingDate: {
//           $year: "$publishingDate",
//         },
//         publisher:1,
//         category:1,
//         author:1,
//         avilable:{$gt:["avilable",1]}
//       },
//     },{ $match: match },
//     ])

//     .then((data) => {
//       response.status(200).json({ data });
//     })
//     .catch((error) => next(error));
// };
