const router = require("express").Router();
const {
  editProfile,
  getOwnProfile,
  createBookmarkCategoryWithBlogs,
  addBlogsToCategory,
  getAllBookmarks,
  createNewBookmarkCategoryWithoutBlog,
  addBookmarkBlogsToCategory,
  removeBookmarkBlogfromCategory,
} = require("../Controllers/User_controllers");
const {
  checTokenAuthentication,
} = require("../Middleware/Authentication_Middleware");

router.post("/updateprofile", checTokenAuthentication, editProfile);
router.get("/getOwnProfile", checTokenAuthentication, getOwnProfile);
router.post("/editprofile", checTokenAuthentication, editProfile);
router.get("/getAllBookmarks", getAllBookmarks);
router.post("/createBookmarkCatWithBlog", createBookmarkCategoryWithBlogs);
router.post("/createNewCatWithoutBlog", createNewBookmarkCategoryWithoutBlog);
router.post("/addBlogsToCategory", addBookmarkBlogsToCategory);
router.post("/removeBlogFromBookmarkCategory", removeBookmarkBlogfromCategory);

module.exports = router;
