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

// Middleware
// app.use(setOriginHeader);
app.use(
  cors({
    origin: ["https://parlour-frontend.vercel.app", "http://localhost:3000"],
  })
);
// app.use(helmet());
app.use(mongoSanitize());
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static("./public"));
app.use(expressFileUpload({ tempFileDir: "/tmp/", useTempFiles: true }));

// Routes

app.use("/api/v1/blogs", require("./Routes/Blog_Routes"));
app.use("/api/v1/user/auth", require("./Routes/User_Routes"));
app.use("/api/v1/imageUpload", require("./Routes/ImageUpload_Routes"));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, () => {
  app.listen(port);
  console.log(`Server Running on ${port}`);
});
