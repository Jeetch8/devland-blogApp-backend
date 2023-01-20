const Blog = require("../Models/Blog_Model");
const CustomError = require("../errors");
const readingTime = require("reading-time");
const User = require("../Models/User_Model");
const { convert } = require("html-to-text");
const mongoose = require("mongoose");

exports.createNewBlog = async (req, res) => {
  const { HTMLBody, title, blogImg, status } = req.body;
  if (!HTMLBody || !title || !blogImg || !status) {
    throw new CustomError.BadRequestError("All feilds are required");
  }

  const newBlog = await Blog.create({
    HTMLBody,
    title,
    blogImg,
    status,
    creator: req.user.userId,
    readingTime: readingTime(convert(HTMLBody)).text,
  });
  res.status(201).json({ success: true });
};

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({}).populate("creator");
  if (req.headers.userid) {
    const user = await User.findById(req.headers.userid);
    const bookmarks = user.bookmarks;
    const newBlogArray = [];
    blogs.forEach((blog) => {
      const blogBookmarks = [];
      bookmarks.forEach((el) => {
        let blogexist = el.category.blogs.indexOf(blog._id);
        if (blogexist !== -1) {
          blogBookmarks.push({
            catTitle: el.category.title,
            isSaved: true,
            catId: el._id,
          });
        } else {
          blogBookmarks.push({
            catTitle: el.category.title,
            isSaved: false,
            catId: el._id,
          });
        }
      });
      const sCreator = {
        name: blog.creator.name,
        profileImg: blog.creator.profileImg,
        userid: blog.creator._id,
        following: blog.creator.following.length,
        followers: blog.creator.followers.length,
      };
      newBlogArray.push({ ...blog._doc, blogBookmarks, creator: sCreator });
    });
    res.status(200).json({ blogs: newBlogArray });
  } else {
    res.status(200).json({ blogs });
  }
};

// const blogs = await Blog.aggregate([
//   {
//     $lookup: {
//       from: "users",
//       localField: "creator",
//       foreignField: "_id",
//       as: "results",
//     },
//   },
//   {
//     $unwind: {
//       path: "$results",
//     },
//   },
//   {
//     $project: {
//       "results.password": 0,
//       "results.following": 0,
//       "results.followers": 0,
//       "results.bookmarks": 0,
//       "results.email": 0,
//       creator: 0,
//     },
//   },
// ]);
// if (headerUserId) {
//   let userSavedBlogs = await User.findById("63a271979c6782c99c0dd086")
//     .populate({
//       path: "bookmarks",
//       populate: {
//         path: "category.blogs",
//       },
//     })
//     .select("bookmarks");
//   const allBlogList = [];
//   userSavedBlogs.bookmarks.forEach((el) => {
//     el.category.blogs.forEach((blog) => {
//       if (allBlogList.indexOf(blog._id) !== -1) return;
//       allBlogList.push(blog._id);
//     });
//   });
//   res.status(200).json({ blogs, bookmarks: userSavedBlogs, allBlogList });
// } else {
//   res.status(200).json({ blogs });
// }

exports.getSingleBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate({
    path: "commentArray",
    populate: {
      path: "user",
      select: "name profileImg",
    },
  });
  res.status(200).json({ blog });
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

exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const { token, ...restValues } = req.body;
  console.log(restValues);
  const updatedBlog = await Blog.findByIdAndUpdate(blogId, restValues, {
    new: true,
  });
  res.status(201).json({ updatedBlog });
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

// aggregate([
//   {
//     $match: {
//       _id: new mongoose.Types.ObjectId("63a271979c6782c99c0dd086"),
//     },
//   },
//   {
//     $unwind: {
//       path: "$bookmarks",
//       includeArrayIndex: "string",
//     },
//   },
//   {
//     $unwind: {
//       path: "$bookmarks.category.blogs",
//       includeArrayIndex: "string",
//     },
//   },
//   {
//     $lookup: {
//       from: "blogs",
//       localField: "bookmarks.category.blogs",
//       foreignField: "_id",
//       as: "result",
//     },
//   },
// ]);
