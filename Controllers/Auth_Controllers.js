const CustomError = require("../errors");
const { createJWT } = require("../Utlis/jwt");
const User = require("../Models/User_Model");

const register = async (req, res) => {
  const { email, name, password, profileImg } = req.body;

  if (!email || !name || !password) {
    throw new CustomError.BadRequestError(
      "Please fill in all details to register"
    );
  }

  const emailAlreadyExists = await User.findOne({ email });
  console.log(emailAlreadyExists, "assad");
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    profileImg,
  });
  console.log(user);
  if (!user) {
    throw new CustomError.BadRequestError("Something went wrong");
  }
  const token = await createJWT(
    { userId: user._id, userName: user.name },
    "30d"
  );
  if (!token) {
    throw new CustomError.CustomAPIError("Something went wrong");
  }

  res.status(200).json({
    success: true,
    profileImg: user.profileImg,
    userName: user.name,
    email: user.email,
    address: user.address,
    userId: user._id,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("Email not found");
  }
  const compPass = await user.checkCryptedPassword(password);
  if (!compPass) {
    throw new CustomError.UnauthorizedError("Password was incorrect");
  }
  const token = await createJWT(
    { userId: user._id, userName: user.name, role: "user" },
    "30d"
  );
  if (!token) {
    throw new CustomError.CustomAPIError("Something went wrong");
  }

  res.status(200).json({
    success: true,
    profileImg: user.profileImg,
    userName: user.name,
    email: user.email,
    address: user.address,
    userId: user._id,
    token,
  });
};

module.exports = {
  register,
  login,
};
