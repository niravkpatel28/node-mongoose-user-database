const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (name) => {
        if (name.length < 3) {
          return false;
        }
        return true;
      },
      message: "Name has to be atleast 3 character long",
    },
  },
  surname: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email Id is needed for registration"],
    // unique: true,
    validate: {
      validator: (email) => {
        //check using regex for a valid email
        const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        return re.test(email);
      },
      message: "Please provide a valid email id",
    },
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
