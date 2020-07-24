const express = require("express");
const {
  getAllUsers,
  createNewUser,
  getSingleUser,
  updateUser,
  deleteUser,
  onlyEmail,
  userStats,
} = require("../controllers/userController");
const router = express.Router();

// create a userController
// the order is important as /user-stats and /only-email may get processed as /:id
router.route("/user-stats").get(userStats);
router.route("/only-email").get(onlyEmail, getAllUsers);
router.route("/").get(getAllUsers).post(createNewUser);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
