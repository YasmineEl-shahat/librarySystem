const bcrypt = require("bcrypt");

module.exports = async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);

  return result;
};
