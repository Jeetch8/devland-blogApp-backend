exports.setOriginHeader = (req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://blog-app-frontend-opal.vercel.app"
  );
  next();
};
