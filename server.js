const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const config = require("config");
const minifyHTML = require("express-minify-html");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const flash = require('connect-flash');
require("./startup/cors")(app);
require("./startup/db")();
require("./startup/compressors")();
require("./middleware/passport")(passport);

const apiRoutes = require("./server/routes/apiRoutes");
const apiAdminRoutes = require("./server/routes/apiAdminRoutes");

const productsRoutes = require("./server/routes/productsRoute");
const usersViewRoutes = require("./server/routes/viewsRoute/users");
const adminViewRoutes = require("./server/routes/viewsRoute/adminRoute");
dotenv.config({ path: "config.env" });
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(
  session({
    secret: config.get("session_secret"),
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(flash());
app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  })
);
app.use(compression());
//set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use("/", usersViewRoutes);
app.use("/admin", adminViewRoutes);
app.use("/api/admin", apiAdminRoutes);
app.use("/api/users", apiRoutes);
app.use("/api/products", productsRoutes);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`server is running on http://localhost:${port}...`)
);
module.exports = server;
