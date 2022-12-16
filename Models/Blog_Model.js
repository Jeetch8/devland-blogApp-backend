const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Blog Title cannot be empty"],
    },
    HTMLBody: {
      type: String,
      require: [true, "Body cannot be emtpy"],
    },
    blogImg: {
      type: String,
    },
    commentArray: [
      {
        commentText: {
          type: String,
          require: [true, "Comment cannot be empty"],
        },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      },
    ],
    likedArray: [
      { userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" } },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blog", blogSchema);
