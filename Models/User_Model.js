const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  following: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
  ],
  followers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
  ],
  bookmarks: [
    {
      category: {
        title: { type: String },
        description: { type: String },
        blogId: [{ type: mongoose.Schema.Types.ObjectId, ref: "blog" }],
      },
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
