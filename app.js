// Express to run server and routes
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const loginRoute = require("./Routes/login");
const authenticationMW = require("./Core/auth/authenticationMW");
//  open server using express
const server = express(); // create http server -> http.createServer()

let port = process.env.port || 8080;
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/libraryDB")
  .then(() => {
    console.log("DB connected");
    // listen port
    server.listen(port, () => {
      console.log("server is listening....", port);
    });
  })
  .catch((error) => {
    console.log("Db Problem " + error);
  });

server.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);
// first MW logging on console
// server.use((request, response, next) => {
//   console.log(request.url, request.method);
//   next();
// });

morgan("tiny");
morgan(":method :url :status :res[content-length] - :response-time ms");

morgan(function (tokens, request, res) {
  return [
    tokens.method(request, res),
    tokens.url(request, res),
    tokens.status(request, res),
    tokens.res(request, res, "content-length"),
    "-",
    tokens["response-time"](request, res),
    "ms",
  ].join(" ");
});

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

//Routes
server.use(loginRoute);
//auth middleware
server.use(authenticationMW);

// not found middleware
server.use((request, response, next) => {
  response.status(404).json({ message: "page not found" });
});

//error middleware
server.use((error, request, response, next) => {
  let status = error.status || 500;
  response.status(status).json({ message: error + "" });
});
