const { register, login } = require("../Controllers/Auth_Controllers");
const router = require("./Blog_Routes");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
