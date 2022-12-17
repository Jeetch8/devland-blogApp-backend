const {
  uploadImageLocal,
  uploadImageCloudinary,
} = require("../Utlis/ImageUpload");

const router = require("express").Router();

router.post("/imageUploadLocal", uploadImageLocal);
router.post("/imagaeUploadCloudniary", uploadImageCloudinary);

module.exports = router;
