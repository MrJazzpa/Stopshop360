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
// API routes

route.post('/api/users/register',controller.create)
route.get('/api/users/',controller.getusers)
route.get('/api/users/verification/',controller.email_verification)
route.get('/api/users',controller.userlogin)

module.exports=route;