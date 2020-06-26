module.exports = {
  Authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/login");
  },

  Unauthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/home");
  },
};
