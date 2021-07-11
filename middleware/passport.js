const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../server/models/userModel");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        //match user
        User.findOne({ email, isConfirmed:1 })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "Email is not registered",
              });
            }
            //match pass
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "pass incorrect" });
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
