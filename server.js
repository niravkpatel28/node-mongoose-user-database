// main file where database connection is established
// Ensure that database is connected before launching app
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });
mongoose
  .connect(process.env.DATABASE_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((connection) => {
    console.log("Database connected");
    //turn on the application once database is connected
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server started on port ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Error in connecting to database");
    console.log(err);
  });
