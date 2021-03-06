module.exports = {
  alreadyAuthenticated: function (req, res, next) {
      if (req.isAuthenticated()) {
        req.flash("error_msg", "Already login, cannot view resource");
        return res.redirect("/");
      }
      return next();
    },
  
    ensureAuthenticated: (req, res, next) =>{
       if(!req.isAuthenticated()){
         req.flash("error_msg", "please login to view this resource");
         return res.redirect("/");
       }
        return next();
    },

    isAdmin: (req, res, next)=>{
        if(!req.user.isAdmin){
          req.flash("error_msg", "You don't have privillege to proceed");
          return res.redirect("/");
        }
        return next();
    }
  };
  
  