const Blog = require("../Models/Blog_Model");
const CustomError = require("../errors");
const User = require("../Models/User_Model");

exports.makeCommentOnBlog = async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;
  const { userId } = req.user;
  const comment = await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: { commentArray: [{ user: userId, commentText: content }] },
    },
    { new: true }
  );
  res.status(201).json({ success: true });
};

exports.likeBlog = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.user;
  const blog = await Blog.findByIdAndUpdate(blogId, {
    $push: { likes: { userId } },
  });
  res.status(201).json({ success: true });
};

exports.editProfile = async (req, res) => {
  const { userId } = req.cookies;
  const updateUser = await User.findByIdAndUpdate(userId, req.body);
  if (!updateUser) {
    throw new CustomError.BadRequestError(
      "Somthing went wrong, please try again"
    );
  }
  res.status(200).json({ success: true });
};

exports.getOwnProfile = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId).select(
    "name email gender profileImg"
  );
  res.status(200).json({ user });
};

exports.getSavedBlogs = async (req, res) => {
  const { userId } = req.user;
  const blogs = await User.findOne({ _id: userId }).populate({
    path: "savedBlogs.blogId",
  });
  res.status(200).json({ blogs });
};

exports.toggleBookmark = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.user;
  const user = await User.findById(userId);
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new CustomError.NotFoundError("Blog not found");
  }
  let isBookmarked = false;
  for (let i = 0; i < user.bookmarks.length; i++) {
    if (user.bookmarks[i]._id.toString() === blogId) {
      isBookmarked = true;
      break;
    }
  }
  if (isBookmarked) {
    await User.findByIdAndUpdate(userId, {
      $pull: { bookmarks: { blogId: blogId } },
    });
    return res.status(201).json({ success: true, bookmarked: !isBookmarked });
  }
  const bookmark = await User.findOneAndUpdate(userId, {
    $push: { bookmarks: { blogId: blogId } },
  });
  res.status(201).json({ success: true, bookmarked: bookmark });
};

exports.getAllBookmarks = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId).populate({
    path: "bookmarks",
    populate: {
      path: "blogId",
      select: "title content blogImg likedArray",
    },
  });
  const temp = user.bookmarks.map((el) => {
    const { likedArray, blogImg, content, title, _id } = el.blogId;
    const likes = likedArray.length;
    return { blogImg, likes, content, title, _id };
  });
  res.status(200).json({ bookmarks: temp });
};
