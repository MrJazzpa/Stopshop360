const { response } = require("express");
const axios = require('axios');

exports.homeRoutes =(req,res)=>{
    
    res.render('index');
}
exports.forgot_email=(req,res)=>{

  res.render('users/forgot_email');
}
exports.change_password=(req,res)=>{

  res.render('users/change_password')
}
exports.ProductPage =(req,res)=>{

    res.render('users/product');

}


exports.verify_code =(req,res)=>{

  res.render('users/verify_code');

}


// User Section
exports.User_Darshboard = (req,res)=>{
 
 res.render('users/User_dashboard/dashboard');
  
}