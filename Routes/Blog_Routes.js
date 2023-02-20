const {
  getAllBlogs,
  getSingleBlog,
  createNewBlog,
  deleteBlog,
  makeCommentOnBlog,
  likeBlog,
} = require("../Controllers/Blog_Controllers");
const {
  checTokenAuthentication,
} = require("../Middleware/Authentication_Middleware");

const router = require("express").Router();

router.get("/", getAllBlogs);
router.get("/:blogId", getSingleBlog);
router.post("/", checTokenAuthentication, createNewBlog);
router.delete("/:blogId", checTokenAuthentication, deleteBlog);
router.put("/:blogId/comment", checTokenAuthentication, makeCommentOnBlog);
router.patch("/:blogId/like", checTokenAuthentication, likeBlog);

module.exports = router;
