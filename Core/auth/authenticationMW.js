const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config/env");

function NotAuthorized(next) {
  let error = new Error("Not Authorized");
  error.status = 401;
  next(error);
}
module.exports = (request, response, next) => {
  try {
    let token = request.get("authorization").split(" ")[1];
    let decoded_token = jwt.verify(token, SECRET_KEY);
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
module.exports.checkAdminsActivate = (request, response, next) => {
  if (
    (request.role == "admin" && request.id == request.params.id) ||
    (request.role == "badmin" && request.id == request.params.id)
  ) {
    next();
  } else NotAuthorized(next);
};
module.exports.checkEmployeeActivate = (request, response, next) => {
  if (request.role == "employee" && request.id == request.params.id) {
    next();
  } else NotAuthorized(next);
};
module.exports.checkMemberActivate = (request, response, next) => {
  if (request.role == "member" && request.id == request.params.id) {
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

module.exports.checkAdmins = (request, response, next) => {
  if (request.role == "badmin" || request.role == "admin") {
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

module.exports.checkBadminOrAdminOrSpesificEmployee = (
  request,
  response,
  next
) => {
  if (
    request.role == "badmin" ||
    request.role == "admin" ||
    (request.role == "employee" && request.id == request.params.id)
  )
    next();
  else NotAuthorized(next);
};

module.exports.checkBaseAdminOremployee = (request, response, next) => {
  if (request.role == "badmin" || request.role == "employee") {
    next();
  } else NotAuthorized(next);
};

module.exports.checkBadminOrAdminOrEmployee = (request, response, next) => {
  if (
    request.role == "badmin" ||
    request.role == "admin" ||
    request.role == "employee"
  )
    next();
  else NotAuthorized(next);
};

module.exports.checkGeneralAuthentication = (request, response, next) => {
  if (
    request.role == "badmin" ||
    request.role == "admin" ||
    request.role == "employee" ||
    request.role == "member"
  )
    next();
  else NotAuthorized(next);
};

module.exports.checkBadminOrEmployeeOrMember = (request, response, next) => {
  if (
    request.role == "badmin" ||
    request.role == "employee" ||
    (request.role == "member" && request.id == request.query.id) ||
    (request.role == "member" && request.id == request.params.id) ||
    (request.role == "member" && request.id == request.body.id)
  )
    next();
  else NotAuthorized(next);
};

module.exports.checkBadminOrAdminOrEmployeeOrMember = (
  request,
  response,
  next
) => {
  if (
    request.role == "badmin" ||
    request.role == "admin" ||
    request.role == "employee" ||
    (request.role == "member" && request.id == request.query.id) ||
    (request.role == "member" && request.id == request.params.id) ||
    (request.role == "member" && request.id == request.body.id)
  )
    next();
  else NotAuthorized(next);
};
