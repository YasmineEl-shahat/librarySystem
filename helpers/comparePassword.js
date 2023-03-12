const bcrypt = require("bcrypt");

module.exports = async function comparePassword(plaintextPassword, hash) {
  console.log(plaintextPassword,hash,"+++")
  const result = await bcrypt.compare(plaintextPassword, hash);
  console.log(plaintextPassword,hash,"+++")
  return result;
};
