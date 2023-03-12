const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = function genHashedPassword(password) {
  hash = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
  return hash;
};
