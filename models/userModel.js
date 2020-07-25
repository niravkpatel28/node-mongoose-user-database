const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
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
    company: {
      type: String,
      required: [true, "Please enter your company name"],
    },
    createdAt: {
      type: Date,
      required: [true, "Please mention date of joining"],
    },
  },
  {
    // additional configuration options to mongoose schema
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

// adding virtual properties
// these properties are the ones that can be derived from the documents itself

userSchema.virtual("DOJ").get(function () {
  if (this.createdAt) {
    // incase the filter doesnot select createdAt field
    let DOJ = this.createdAt.toLocaleString();
    return DOJ;
  }
  return null;
});

userSchema.virtual("experience").get(function () {
  if (this.createdAt) {
    let experience = Date.now() - this.createdAt.getTime();
    // console.log("current experience ", experience);
    // let months = Math.floor(experience / (1000 * 60 * 24 * 30)); // for months
    let months = Math.floor(experience / (1000 * 60)); // number of minutes
    return months + " months";
  }
});
const User = mongoose.model("User", userSchema);

module.exports = User;
