const { param } = require("express-validator");
exports.intParam = [
  param("id").isInt().withMessage("id param should be integer"),
];
exports.objectIdParam = [
  param("id").isMongoId().withMessage("id param should object id"),
];
