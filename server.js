require("dotenv").config();
require("express-async-errors");

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
const expressFileUpload = require("express-fileupload");
const notFoundMiddleware = require("./Middleware/Not_Found_Middleware");
const errorHandlerMiddleware = require("./Middleware/error-handler");

// Middleware
app.use(express.json({ limit: "100mb" }));
app.use(morgan("dev"));
app.use(express.static("./public"));
app.use(expressFileUpload({ tempFileDir: "/tmp/", useTempFiles: true }));

// Routes
app.use("/api/v1/blogs", require("./Routes/Blog_Routes"));
app.use("/api/v1/auth", require("./Routes/Auth_Routes"));
app.use("/api/v1/user", require("./Routes/User_Routes"));
app.use("/api/v1/imageUpload", require("./Routes/ImageUpload_Routes"));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, () => {
  app.listen(port);
  console.log("DB connected");
  console.log(`Server Running on ${port}`);
});
