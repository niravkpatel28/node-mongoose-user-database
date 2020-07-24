const express = require("express");
const {
  getAllUsers,
  createNewUser,
  getSingleUser,
  updateUser,
  deleteUser,
  onlyEmail,
} = require("../controllers/userController");
const router = express.Router();

// create a userController
router.route("/only-email").get(onlyEmail, getAllUsers);
router.route("/").get(getAllUsers).post(createNewUser);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);
module.exports = router;
