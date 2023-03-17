const fse = require("fs-extra");
require("./../Model/bookOperations");
const mongoose = require("mongoose");
const bookOperationSchema = mongoose.model("bookOperations");
const path = require("path");

exports.report = (request, response, next) => {
  bookOperationSchema
    .find({})
    .populate({ path: "bookId", select: { title: 1, _id: 0 } })
    .populate({ path: "memberId", select: { fullName: 1, _id: 0 } })
    .populate({ path: "employeeId", select: { fname: 1, lname: 1, _id: 0 } })
    .then((data) => {
      const format = data.map((report) => {
        return {
          id: report.id,
          bookTitle: report.bookId.title,
          member: report.memberId.fullName,
          employee: report.employeeId.fname + " " + report.employeeId.lname,
          type: report.type,
          deadLineDate: report.deadLineDate,
          returnDate: report.returnDate,
          createDate: report.createdAt,
        };
      });
      fse.writeJSON(
        path.join(
          __dirname,
          "..",
          "Reports/" + "report.json" + "-" + Date.now()
        ),
        { report: format },
        (error) => next(error)
      );
      response.status(200).json({ massege: "create report" });
    })
    .catch((error) => next(error));
};
