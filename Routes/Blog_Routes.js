const {
  getAllBlogs,
  getSingleBlog,
  createNewBlog,
} = require("../Controllers/Blog_Controllers");
const { createBookmarkCategory } = require("../Controllers/User_controllers");
const {
  checTokenAuthentication,
} = require("../Middleware/Authentication_Middleware");

const router = require("express").Router();

router.get("/", getAllBlogs);
router.get("/blog/:blogId", getSingleBlog);
router.post("/createNewBlog", checTokenAuthentication, createNewBlog);

module.exports = router;
