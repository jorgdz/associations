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

  Authorization(...roles) {
    return async (req, res, next) => {
      try {
        if (roles.indexOf(req.user.role.name) != -1) {
          return next();
        } else {
          return res.redirect("/home");
        }
      } catch (e) {
        next(e);
      }
    };
  },
};
