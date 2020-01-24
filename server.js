const express = require("express");
const postRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");
const morgan = require("morgan");

const server = express();


server.use(express.json());
server.use(morgan(':method :url :date[web]'));
server.use('/users', userRouter);
server.use('/posts', postRouter);


server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

// server.use(function (err, req, res, next) {
//   console.error(err.message);
//   if (!err.statusCode) err.statusCode = 500;
//   res.status(err.statusCode).send(err.message);
//   next(err);
// });

module.exports = server;