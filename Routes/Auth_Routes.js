const {
  logout,
  register,
  login,
  verifyEmailforRegistration,
  forgotPassStep2,
  forgotPasswordStep1,
} = require("../Controller/Auth_Controller");
const router = require("./Blog_Routes");

router.get("/logout", logout);
router.post("/register", register);
router.post("/login", login);
router.get("/verifyEmail/:id", verifyEmailforRegistration);
router.post("/forgotPassword", forgotPasswordStep1);
router.post("/forgotPassword2/:id", forgotPassStep2);

module.exports = router;
