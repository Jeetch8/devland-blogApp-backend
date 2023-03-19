const Blog = require("../Models/Blog_Model");
const CustomError = require("../errors");
const User = require("../Models/User_Model");

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
  const id = req.params.blogId;
  const blog = await Blog.findOne({ _id: id }).populate({
    path: "commentArray",
    populate: {
      path: "user",
      select: "name",
    },
  });
  res.status(200).json({ blog });
};

exports.getSingleBlogForRegisterdUser = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.user;
  if (!blogId) {
    throw new CustomError.BadRequestError("Blog id is required");
  }
  const blog = await Blog.findById(blogId).populate({
    path: "commentArray",
    populate: {
      path: "userId",
      select: "name profileImg",
    },
  });
  const user = await User.findById(userId);
  let isBookmarked = false;
  for (let i = 0; i < user.bookmarks.length; i++) {
    if (user.bookmarks[i]._id.toString() === blogId) {
      isBookmarked = true;
      break;
    }
  }
  let isLiked = false;
  for (let i = 0; i < blog.likedArray.length; i++) {
    if (blog.likedArray[i]._id.toString() === userId) {
      isLiked = true;
      break;
    }
  }
  res.status(200).json({ blog, isBookmarked, isLiked });
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
  console.log(content, blogId);
  const { userId } = req.user;
  const comment = await Blog.findByIdAndUpdate(blogId, {
    $push: { commentArray: [{ userId, commentText: content }] },
  });
  res.status(201).json({ success: true });
};

exports.likeBlog = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.user;
  const blog = await Blog.findById(blogId);
  if (blog.likedArray.includes(userId)) {
    throw new CustomError.BadRequestError("Cannot like a blog twice");
  }
  blog.likedArray.push(userId);
  blog.save();
  res.status(201).json({ success: true });
};

exports.searchBlogs = async (req, res) => {
  const { searchQuery } = req.query;
  console.log(searchQuery);
  const blogs = await Blog.find({
    title: { $regex: searchQuery, $options: "i" },
  });
  res.status(200).json({ blogs });
};
