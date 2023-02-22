const router = require("express").Router();
const {
  editProfile,
  getOwnProfile,
  getAllBookmarks,
  toggleBookmark,
} = require("../Controllers/User_controllers");
const {
  checTokenAuthentication,
} = require("../Middleware/Authentication_Middleware");

router.post("/updateprofile", checTokenAuthentication, editProfile);
router.get("/getOwnProfile", checTokenAuthentication, getOwnProfile);
router.post("/editprofile", checTokenAuthentication, editProfile);
router.get("/getAllBookmarks", checTokenAuthentication, getAllBookmarks);
router.patch(
  "/toggleBookmark/:blogId",
  checTokenAuthentication,
  toggleBookmark
);

module.exports = router;
