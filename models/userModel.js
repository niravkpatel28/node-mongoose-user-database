const mongoose = require("mongoose");
// const slugify = require("slugify");
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
    // this is just to create unique names for input values
    // slug: {
    //   type: String,
    // },
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

//Adding pre hooks. Document middleware
// This middleware is executed before the document is saved or created
// pre save hook or pre save middleware
userSchema.pre("save", function (next) {
  try {
    console.log("New user about to be saved ", this);
    // this.slug = slugify(`${this.name} ${this.surname}`);
    // console.log(this.slug);
    next();
  } catch (err) {
    console.log(err);
    res.status(501).json({
      status: "Error in creating new users",
      error: err,
    });
  }
});

// post hook document middleware

userSchema.post("save", function (next) {
  // console.log("post middleware created", this);
  next();
});
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
