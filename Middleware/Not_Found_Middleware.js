const notFoundMiddleware = (req, res) =>
  res.status(404).json("404 Route does not exist");

module.exports = notFoundMiddleware;
