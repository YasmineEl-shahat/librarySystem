require("dotenv").config();
module.exports = {
  ENV: process.env.ENV,
  SECRET_KEY: process.env.SECRET_KEY,
  PORT: process.env.PORT,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
  DEFAULTPASS: process.env.DEFAULTPASS,
};
