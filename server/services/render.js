const { response } = require("express");

exports.homeRoutes =(req,res)=>{

    res.render('index', {test:"i am checking this thing"});
}
exports.ProductPage =(req,res)=>{

    res.render('product');

}


exports.verify_code =(req,res)=>{

  res.render('verify_code');

}


// User Section
exports.User_Darshboard = (req,res)=>{
  res.render('users/dashboard');
}