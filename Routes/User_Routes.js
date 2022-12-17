const router = require("express").Router();
const {
  editProfile,
  getOwnProfile,
} = require("../Controllers/User_controllers");
const {
  checTokenAuthentication,
} = require("../Middleware/Authentication_Middleware");

router.post("/updateprofile", checTokenAuthentication, editProfile);
router.get("/getOwnProfile", checTokenAuthentication, getOwnProfile);
router.post("/editprofile", checTokenAuthentication, editProfile);

module.exports = router;
