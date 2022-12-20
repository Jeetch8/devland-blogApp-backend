const {
  getAllBlogs,
  getSingleBlog,
  deleteComment,
  editBlog,
} = require("../Controllers/Blog_Controllers");
const {
  makeCommentOnBlog,
  saveBlogToUser,
  likeBlog,
  getSavedBlogs,
} = require("../Controllers/Blog_Controllers");
const {
  checkAdminTokenAuthentication,
  checTokenAuthentication,
} = require("../Middleware/Authentication_Middleware");

const router = require("express").Router();

router.get("/", getAllBlogs);
router.get("/blog/:blogId", getSingleBlog);

module.exports = router;
