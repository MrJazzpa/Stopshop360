module.exports = {
  alreadyAuthenticated: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash("error_msg", "Already login, cannot view resource");
      return res.redirect("/");
    },
  
    ensureAuthenticated: (req, res, next) =>{
       if(!req.isAuthenticated()){
        req.flash("error_msg", "please login to view this resource");
        return res.redirect("/");
      }      
      return next();
    },
  };
  
  