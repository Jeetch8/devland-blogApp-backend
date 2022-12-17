const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

userSchema.pre("save", async () => {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

module.exports = mongoose.model("user", userSchema);
