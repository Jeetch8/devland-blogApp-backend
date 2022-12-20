const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  profileImg: {
    type: String,
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
  accountVerification: {
    type: String,
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.checkCryptedPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("user", userSchema);
