const Blog = require("../Models/Blog_Model");
const CustomError = require("../errors");

exports.createNewBlog = async (req, res) => {
  const { HTMLBody, title, blogImg } = req.body;
  if (!HTMLBody && !title && !blogImg) {
    throw new CustomError.BadRequestError("All feilds are required");
  }
  const newBlog = await Blog.create({
    HTMLBody,
    title,
    blogImg,
    creator: req.user.userId,
  });
  res.status(201).json({ success: true });
};

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  // statsRecorder();
  res.status(201).json({ blogs });
};

exports.getSingleBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate({
    path: "commentArray",
    populate: {
      path: "user",
      select: "name profileImg",
    },
  });
  res.status(201).json({ blog });
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

exports.getSingleBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId)
    .populate("user", "name profilePic")
    .populate({
      path: "commentArray",
      populate: { path: "user", select: "name profilePic" },
    });
  res.status(201).json({ blog, success: true });
};

exports.createBlog = async (req, res) => {
  const { title, HTMLBody, status } = req.body;
  const { userId } = req.user;
  try {
    const blog = await Blog.create({
      title,
      HTMLBody,
      user: userId,
      status,
    });
    res.status(201).json({ blog });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error });
  }
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

exports.getAllHomeBlogs = async (req, res) => {
  const blogs = await Blog.find({}).populate("user", "profilePic name");
  const blogTitleArray = [];
  blogs.forEach((blog) => {
    blogTitleArray.push({ label: blog.title, value: blog._id });
  });
  res.status(201).json({ blogs, blogTitleArray });
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
