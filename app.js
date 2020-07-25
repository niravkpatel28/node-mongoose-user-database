const express = require("express");
const userRouter = require("./routes/userRouter");
const path = require("path");
const app = express();
// adding middlewares
app.use(express.json());
// checking for query parameters
// app.use((req, res, next) => {
//   console.log(req.query);
//   next();
// });
app.use(express.static(path.join(__dirname, "public")));
app.use("/users", userRouter);

module.exports = app;
