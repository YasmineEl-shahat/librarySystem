const express = require("express");
const { validateBookOperation } = require("./../Core/bookValidationArray");
const validateMW = require("./../Core/validations/validateMW");
const bookOperationController = require("./../Controller/bookOperationController");
const {
  checkBadminOrAdminOrEmployee,
  checkBadminOrAdminOrEmployeeOrMember,
  checkGeneralAuthentication,
  checkBaseAdminOremployee,
} = require("./../Core/auth/authenticationMW");
const router = express.Router();

router
  .route("/AllBookOperation")
  .get(
    checkBadminOrAdminOrEmployee,
    bookOperationController.getAllBookOperation
  );

router
  .route("/book/borrowed")
  .get(checkBadminOrAdminOrEmployee, bookOperationController.getBorrowedBook);
router
  .route("/book/mostBorrowed")
  .get(checkGeneralAuthentication, bookOperationController.mostBorrowedBook);
router
  .route("/book/mostReading")
  .get(checkGeneralAuthentication, bookOperationController.mostReadingBook);
router
  .route("/book/reading")
  .get(
    checkBadminOrAdminOrEmployeeOrMember,
    bookOperationController.getReadingBook
  );
router
  .route("/borrowedBooks/list")
  .get(
    checkBadminOrAdminOrEmployeeOrMember,
    bookOperationController.borrowBooksList
  );
router
  .route("/readingBooks/list")
  .get(
    checkBadminOrAdminOrEmployeeOrMember,
    bookOperationController.readBooksList
  );
router
  .route("/book/read")
  .post(checkBadminOrAdminOrEmployee, bookOperationController.readBook);

router
  .route("/book/return")
  .post(checkBadminOrAdminOrEmployee, bookOperationController.returnBook);

router
  .route("/book/borrow")
  .post(
    checkBadminOrAdminOrEmployee,
    validateBookOperation,
    validateMW,
    bookOperationController.borrowBooks
  );

router
  .route("/borrowedBooks/current")
  .get(
    checkBadminOrAdminOrEmployeeOrMember,
    bookOperationController.currentBorrowedBooks
  );

router
  .route("/membersViolatedDate")
  .get(checkBaseAdminOremployee, bookOperationController.membersViolatedDate);

module.exports = router;
