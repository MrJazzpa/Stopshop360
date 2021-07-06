const express = require('express');
const route = express.Router();

// declearing the routes
const services = require('../services/render');
const controller = require('../controller/User_Controller');


// home route
route.get('/',services.homeRoutes);
route.get('/products',services.ProductPage);
route.get('/dashboard',services.User_Darshboard);
route.get('/email_verification',services.verify_code);
route.get('/forgot_email',services.forgot_email);
route.get('/change_password',services.change_password);
// API routes

route.post('/api/users/register',controller.User_Registration)
route.get('/api/users/login',controller.userlogin)
route.get('/api/users/verification/',controller.email_verification)
route.get('/api/users/',controller.getusers)



module.exports=route;