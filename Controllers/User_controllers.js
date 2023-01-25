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
  console.log(comment);
  res.status(201).json({ success: true });
};

exports.likeBlog = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.user;
  const blog = await Blog.findByIdAndUpdate(blogId, {
    $push: { likes: userId },
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
  const { userId } = req.cookies;
  const user = await User.findById(userId).select(
    "name email gender profileImg address"
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

exports.createBookmarkCategoryWithBlogs = async (req, res) => {
  const newCat = await User.findByIdAndUpdate(req.body.userId, {
    $push: {
      bookmarks: {
        "category.title": req.body.title,
        "category.description": req.body.description,
        "category.blogs": req.body.blogId,
      },
    },
  });
  res.status(200).json({ success: true });
};

exports.createNewBookmarkCategoryWithoutBlog = async (req, res) => {
  const newCat = await User.findByIdAndUpdate(req.body.userId, {
    $push: {
      bookmarks: {
        "category.title": req.body.title,
        "category.description": req.body.description,
        // "category.blogs": req.body.blogId,
      },
    },
  });
  res.status(200).json({ success: true });
};

exports.updateBookmarkCategoryName = async (req, res) => {
  const updateName = await User.updateOne(
    { _id: req.body.userId },
    { $set: { "bookmarks.$[m].category.title": "testing updates" } },
    { arrayFilters: [{ "m._id": "63a722b1011ed79d8f2c4820" }] }
  );
  res.status(200).json({ success: true });
};

exports.addBookmarkBlogsToCategory = async (req, res) => {
  const updatingBookmarks = await User.updateOne(
    { _id: req.body.userId },
    {
      $push: {
        "bookmarks.$[m].category.blogs": req.body.blogId,
      },
    },
    {
      arrayFilters: [
        {
          "m._id": req.body.catId,
        },
      ],
    }
  );
  res.status(200).json({ success: true });
};

exports.removeBookmarkBlogfromCategory = async (req, res) => {
  const updatingBookmarks = await User.updateOne(
    { _id: req.body.userId },
    {
      $pull: {
        "bookmarks.$[m].category.blogs": req.body.blogId,
      },
    },
    {
      arrayFilters: [
        {
          "m._id": req.body.catId,
        },
      ],
    }
  );
  res.status(200).json({ success: true });
};

// Update category name
// const update = await User.updateOne(
//   { _id: "63a271979c6782c99c0dd086" },
//   { $set: { "bookmarks.$[m].category.title": "testing updates" } },
//   { arrayFilters: [{ "m._id": "63a722b1011ed79d8f2c4820" }] }
// );

// creating new category with blogs
// const updater = await User.findByIdAndUpdate("63a271979c6782c99c0dd086", {
//   $push: {
//     bookmarks: {
//       "category.title": "Test category4",
//       "category.blogs": [
//         "63a2897b7cb91708a5acaf83",
//         "63a2897b7cb91708a5acaf83",
//         "63a2897b7cb91708a5acaf83",
//         "63a2897b7cb91708a5acaf83",
//         "63a2897b7cb91708a5acaf83",
//       ],
//     },
//   },
// $push: { bookmarks: { "category.blogs": "63a2897b7cb91708a5acaf83" } },
// });

// Pushing new blogs
// const update = await User.updateOne(
//   { _id: "63a271979c6782c99c0dd086" },
//   {
//     $push: {
//       "bookmarks.$[m].category.blogs": {
//         blogId: "63a2897b7cb91708a5acaf83",
//         notes: "Test notes",
//       },
//     },
//   },
//   {
//     arrayFilters: [
//       {
//         "m._id": "63a722b1011ed79d8f2c4820",
//         // "b.blogId": "63a2897b7cb91708a5acaf83",
//       },
//     ],
//   }
// );

exports.getAllBookmarks = async (req, res) => {
  const user = await User.findById(req.headers.userid);
  res.status(200).json({ bookmarks: user.bookmarks });
};
