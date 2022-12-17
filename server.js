require("dotenv").config();
require("express-async-errors");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const expressFileUpload = require("express-fileupload");
const notFoundMiddleware = require("./Middleware/Not_Found_Middleware");
const errorHandlerMiddleware = require("./Middleware/error-handler");
const mongoSanitize = require("express-mongo-sanitize");
const { setOriginHeader } = require("./Middleware/OriginSetter");

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://blog-app-frontend-opal.vercel.app",
    ],
  })
);
// app.use(setOriginHeader());
app.use(mongoSanitize());
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static("./public"));
app.use(expressFileUpload({ tempFileDir: "/tmp/", useTempFiles: true }));

// Routes

app.get("/", (req, res) => {
  res.cookie("testToken", "testTokenValue", {
    httpOnly: false,
    expires: new Date(Date.now() + 900000),
    secure: true,
    sameSite: "none",
  });
  res.status(200).json("Cookies set");
});
app.use("/api/v1/blogs", require("./Routes/Blog_Routes"));
app.use("/api/v1/auth", require("./Routes/Auth_Routes"));
app.use("/api/v1/imageUpload", require("./Routes/ImageUpload_Routes"));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, () => {
  app.listen(port);
  console.log(`Server Running on ${port}`);
});
