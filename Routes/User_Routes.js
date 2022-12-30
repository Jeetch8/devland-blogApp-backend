const router = require("express").Router();
const {
  editProfile,
  getOwnProfile,
  createBookmarkCategoryWithBlogs,
  createNewCategoryWithoutBlog,
  addBlogsToCategory,
  getAllBookmarks,
} = require("../Controllers/User_controllers");
const {
  checTokenAuthentication,
} = require("../Middleware/Authentication_Middleware");

router.post("/updateprofile", checTokenAuthentication, editProfile);
router.get("/getOwnProfile", checTokenAuthentication, getOwnProfile);
router.post("/editprofile", checTokenAuthentication, editProfile);
router.post("/createBookmarkCatWithBlog", createBookmarkCategoryWithBlogs);
router.post("/createNewCatWithoutBlog", createNewCategoryWithoutBlog);
router.post("/addBlogsToCategory", addBlogsToCategory);
router.get("/getAllBookmarks", getAllBookmarks);

module.exports = router;
