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
checTokenAuthentication,
  // router.get(
  //   "/saveBlogForUser/:blogId",
  //   checTokenAuthentication,
  //   saveBlogToUser
  // );
  // router.post("/saveBlog", checkAdminTokenAuthentication, saveBlog);
  // router.get(
  //   "/publishDraftedBlog/:blogId",
  //   checkAdminTokenAuthentication,
  //   publishDraftedBlog
  // );
  // router.post("/blogComment/:blogId", checTokenAuthentication, makeCommentOnBlog);
  // router.delete("/deleteBlog/:blogId", checkAdminTokenAuthentication, deleteBlog);
  // router.post("/deleteComment", checkAdminTokenAuthentication, deleteComment);
  // router.get("/likePost/:blogId", checTokenAuthentication, likeBlog);
  // router.get("/savedblogs", checTokenAuthentication, getSavedBlogs);
  // router.post("/editblog/:blogId", checkAdminTokenAuthentication, editBlog);

  (module.exports = router);
