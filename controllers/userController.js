//getAllUsers should query the database for all users
const User = require("../models/userModel");

const ApiFeatures = require("../utils/apiFeatures");

//Api Controller for fetching all users
const getAllUsers = async (req, res, next) => {
  // printing query parameters

  // console.log(req.query);
  try {
    //this returns a query which can then be chained to different
    // query methods
    let query = User.find();
    const features = new ApiFeatures(User.find(), req.query);
    // the features will contain this object that has a query
    const allUsers = await features.sort().fieldLimit().pagination().query;
    // console.log("data fetched", allUsers);

    // step 1 sorting the result using email
    // sorting takes a string or an object
    //https://mongoosejs.com/docs/api/query.html#query_Query-sort
    // sort in ascending order using email
    // query = query.sort({ email: 1 });

    //sort in descending order using email
    // query = query.sort({ email: -1 });
    // if (req.query.sort) {
    //   query = query.sort(req.query.sort.split(",").join(" "));
    // }

    //step 2 field limiting
    // fields will be specified in the query as
    // localhost:3000/users?fields=name,email,...

    //here only name and email will be sent

    // if (req.query.fields) {
    //   let fields = req.query.fields.split(",").join(" ");
    //   // console.log(fields);
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }
    // to exclude a particular field
    // here __v is excluded simply by putting a - sign
    // this is handy when excluding password and other sensitive information
    // query = query.select("-__v");

    // step 3 Pagination
    // only sending limited number of results (results per page mechanism)
    // this is implemented using skip( number ) and limit( number  )
    // query = query.skip(3).limit(3);
    // let allUsers = await query;
    res.status(200).json({
      status: "Successful",
      data: {
        count: allUsers.length,
        users: allUsers,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error in fetching users",
      error: err,
    });
  }

  //   User.find()
  //     .then((data) => {
  //       res.status(200).json({
  //         status: "Successful",
  //         data,
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(400).json({
  //         status: "Error in fetching data",
  //         error: err,
  //       });
  //     });
};

//createNewUser will add a new user to the database
const createNewUser = (req, res, next) => {
  //create a new user
  // Method 1
  // const newUser = new User({
  //   name: req.body.name,
  //   surname: req.body.surname,
  // });
  // newUser
  //   .save()
  //   .then((data) => {
  //     res.status(200).json({
  //       status: "successfully added a user",
  //       data: {
  //         user: data,
  //       },
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(400).json({
  //       message: "Error in adding to database",
  //       err: err,
  //     });
  //   });
  // Method 2 Using model name
  User.create({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    company: req.body.company,
    createdAt: Date.now(), //create a date of joining
  })
    .then((data) => {
      console.log("Data written succesfully", data);
      res.status(200).json({
        status: "Status",
        data: {
          user: data,
        },
      });
    })
    .catch((err) => {
      // console.log("Error in writing the data", err);
      res.status(400).json({
        status: "Error in creating user",
        error: err,
      });
      return new Error("Error while creating a new user", err);
    });
};

const getSingleUser = (req, res, next) => {
  console.log(req.params.id);
  User.findById(req.params.id)
    .then((user) => {
      res.status(200).json({
        status: "Successful",
        data: {
          user: user,
        },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "Not found",
        error: err,
      });
    });
};

// using asyn function
const updateUser = async (req, res, next) => {
  try {
    console.log(req.params.id);
    let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // validators donot run on update so to enable it
      useFindAndModify: false,
    });
    res.status(200).json({
      status: "Successfully Updated User ",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Error in update",
      error: err,
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "Successfully deleted user",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "Error in deleting user",
      error: err,
    });
  }
};

const onlyEmail = (req, res, next) => {
  console.log(req.url);
  req.query.fields = "email";
  console.log(req.url);
  next();
};

const userStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      // {
      //   $match: { company: "Surfboard" },
      //   // match based only on company name
      // },
      {
        // group the employees of one company into an array
        $group: {
          _id: "$company",

          //counting employee numbers for each company
          employeeCount: {
            $sum: 1,
          },
          employee: {
            $push: { name: "$name", surname: "$surname", email: "$email" },
          },
        },
      },
      // {
      //   $group: { _id: "$company", employeeCount: { $sum: 1 }, name: {} },
      // },
    ]);

    res.status(200).json({
      status: "Successfully Updated User ",
      data: {
        stats: stats,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "Error in collecting statistics",
      error: err,
    });
  }
};
module.exports.getAllUsers = getAllUsers;
module.exports.createNewUser = createNewUser;
module.exports.getSingleUser = getSingleUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.onlyEmail = onlyEmail;
module.exports.userStats = userStats;
//Aggregation framework
// https://masteringjs.io/tutorials/mongoose/aggregate
