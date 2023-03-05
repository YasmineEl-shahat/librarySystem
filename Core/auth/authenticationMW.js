const { request, response } = require("express");
const jwt = require("jsonwebtoken");

let sk = process.env.SECRET_KEY || "SK";

function NotAuthorized(next) {
  let error = new Error("Not Authorized");
  error.status = 401;
  next(error);
}
module.exports = (request, response, next) => {
  try {
    let token = request.get("authorization").split(" ")[1];
    let decoded_token = jwt.verify(token, sk);
    request.id = decoded_token.id;
    request.role = decoded_token.role;
    next();
  } catch (error) {
    error.status = 401;
    error.message = "Not Authorized";
    next(error);
  }
};
module.exports.checkBaseAdmin = (request, response, next) => {
  if (request.role == "badmin") {
    next();
  } else NotAuthorized(next);
};
module.exports.checkAdmin = (request, response, next) => {
  if (request.role == "admin" && request.id == request.params.id) {
    next();
  } else NotAuthorized(next);
};
module.exports.checkAdminOrBadmin = (request, response, next) => {
  if (
    request.role == "badmin" ||
    (request.role == "admin" && request.id == request.params.id)
  ) {
    next();
  } else NotAuthorized(next);
};

module.exports.employeeOrAdmin = (request, response, next) => {
  if (
    request.role == "admin" ||
    (request.role == "employee" && request.id == request.params.id)
  ) {
    next();
  } else NotAuthorized(next);
};

module.exports.checkBadminOrAdminOrEmployee = (request, response, next) => {
  if (
    request.role == "badmin" ||
    request.role == "admin" ||
    (request.role == "employee" && request.id == request.params.id)
  )
    next();
  else NotAuthorized(next);
};

module.exports.baseAdminOremployee = (request, response, next) => {
  if (
    request.role == "badmin" ||
    (request.role == "employee" && request.id == request.params.id)
  ) {
    next();
  } else NotAuthorized(next);
};

module.exports.checkBadminOrEmployeeOrMember = (request, response, next) => {
  console.log(request.role);
  if (request.role == "badmin" || request.role == "employee"
    || (request.role == "member" && request.id == request.body._id))
    next();
  else NotAuthorized(next);
};
