module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    const error = new Error("Unauthorized request!")
    error.status = 401
    return next(error);
  }
};
