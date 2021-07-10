const fs = require("fs");
const uglifyJs = require("uglify-js");

module.exports = function(){
const appClientFiles = [
    fs.readFileSync("assets/js/bootstrap-input-spinner.js", "utf8"),
    fs.readFileSync("assets/js/bootstrap.bundle.min.js", "utf8"),
    fs.readFileSync("assets/js/fileupload.js", "utf8"),
    fs.readFileSync("assets/js/imagesloaded.pkgd.min.js", "utf8"),
    fs.readFileSync("assets/js/isotope.pkgd.min.js", "utf8"),
    fs.readFileSync("assets/js/jquery.countdown.min.js", "utf8"),
    fs.readFileSync("assets/js/jquery.countTo.js", "utf8"),
    fs.readFileSync("assets/js/jquery.elevateZoom.min.js", "utf8"),
    fs.readFileSync("assets/js/jquery.hoverIntent.min.js", "utf8"),
    fs.readFileSync("assets/js/jquery.magnific-popup.min.js", "utf8"),
    fs.readFileSync("assets/js/jquery.min.js", "utf8"),
    fs.readFileSync("assets/js/jquery.plugin.min.js", "utf8"),
    fs.readFileSync("assets/js/jquery.sticky-kit.min.js", "utf8"),
    fs.readFileSync("assets/js/jquery.waypoints.min.js", "utf8"),
    fs.readFileSync("assets/js/main.js", "utf8"),
    fs.readFileSync("assets/js/nouislider.min.js", "utf8"),
    fs.readFileSync("assets/js/owl.carousel.min.js", "utf8"),
    fs.readFileSync("assets/js/superfish.min.js", "utf8"),
    fs.readFileSync("assets/js/wNumb.js", "utf8"),
    fs.readFileSync("assets/js/demos/demo-3.js", "utf8"),
  ];
  
  let uglifiedClient = uglifyJs.minify(appClientFiles, { compress: false });
  fs.writeFile("assets/js/shop.min.js", uglifiedClient.code, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Script generated and saved: shop.min.js");
    }
  });
}