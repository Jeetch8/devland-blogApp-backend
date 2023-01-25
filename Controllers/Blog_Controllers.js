const Blog = require("../Models/Blog_Model");
const CustomError = require("../errors");
const readingTime = require("reading-time");
const User = require("../Models/User_Model");
const { convert } = require("html-to-text");
const mongoose = require("mongoose");

exports.createNewBlog = async (req, res) => {
  const { content, title, blogImg, status } = req.body;
  if (!content || !title || !blogImg || !status) {
    throw new CustomError.BadRequestError("All feilds are required");
  }

  const newBlog = await Blog.create({
    content,
    title,
    blogImg,
    status,
    creator: req.user.userId,
  });
  res.status(201).json({ success: true });
};

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  res.status(200).json({ blogs });
};

exports.getSingleBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);
  res.status(200).json({ blog });
};

exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const { token, ...restValues } = req.body;
  console.log(restValues);
  const updatedBlog = await Blog.findByIdAndUpdate(blogId, restValues, {
    new: true,
  });
  res.status(201).json({ updatedBlog });
};

exports.deleteBlog = async (req, res) => {
  const { userId } = req.user;
  const { blogId } = req.body;
  const blog = await Blog.findById(blogId);
  if (blog.user !== userId) {
    throw new CustomError.UnauthorizedError("Can only delete your own blogs");
  }
  blog.delete();
  res.status(201).json({ success: true });
};

exports.editBlog = async (req, res) => {
  const { blogId } = req.params;
  console.log(blogId);
  const updateBlog = await Blog.findByIdAndUpdate(
    blogId,
    {
      title: req.title,
      HTMLBody: req.HTMLBody,
      blogImg: req.blogImg,
    },
    { new: true }
  );
  res.status(200).json({ success: true, updateBlog });
};

exports.deleteComment = async (req, res) => {
  const { commentId, blogId } = req.body;
  console.log(commentId);
  await Blog.updateOne(
    {
      _id: blogId,
    },
    {
      $pull: {
        commentArray: {
          _id: commentId,
        },
      },
    }
  );
  res.status(200).json({ success: true });
};

exports.publisDrfthBlog = async (req, res) => {
  const { blogId } = req.body;
  const { userId } = req.body;
  const blog = await Blog.findById(blogId);
  if (blog.user !== userId) {
    throw new CustomError.UnauthorizedError("can only modify your own blogs");
  }
  blog.status = "published";
  blog.update();
  res.status(201).json({ success: true });
};

exports.makeCommentOnBlog = async (req, res) => {
  const { content, blogId } = req.body;
  const { userId } = req.user;
  console.log(userId);
  const comment = await Blog.findByIdAndUpdate(blogId, {
    $push: { commentArray: [{ user: userId, commentText: content }] },
  });
  res.status(201).json({ success: true });
};
