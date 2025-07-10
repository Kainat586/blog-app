const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");

router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    const postCount = await Post.countDocuments({ author: decoded.email.split("@")[0] });

    res.json({
      email: user.email,
      name: user.name,
      bio: user.bio,
      profileImage: user.profileImage,
      postCount
    });
  } catch (err) {
    res.status(500).json({ error: "Profile fetch failed." });
  }
});

module.exports = router;
