const passport = require("passport");
const User = require("../src/Models").User;
const Role = require("../src/Models").Role;
const LocalStrategy = require("passport-local").Strategy;
const helpers = require("./helpers");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findAll({
    where: { id: id },
    include: [
      {
        model: Role,
        as: "role",
      },
    ],
  })
    .then((user) => {
      done(null, user[0]);
    })
    .catch((err) => console.log(err));
});

passport.use(
  "local.login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findAll({
        where: { email: email },
        include: [
          {
            model: Role,
            as: "role",
          },
        ],
      })
        .then((user) => {
          if (!helpers.matchPassword(password, user[0].password)) {
            done(
              null,
              false,
              req.flash("message", "La contraseña es incorrecta")
            );
          }
          done(null, user[0]);
        })
        .catch((err) => {
          return done(
            null,
            false,
            req.flash("message", "El usuario no existe!")
          );
        });
    }
  )
);
