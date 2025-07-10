const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: { type: String, default: "" },
  bio: { type: String, default: "" },
  profileImage: { type: String, default: "" } // store filename or full URL
});

module.exports = mongoose.model("User", UserSchema);
