const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

//importing connection
const connectDB = require('./server/database/connection');

dotenv.config({path:'config.env'});

const PORT = process.env.PORT || 8080;
  
//log request
app.use(morgan('tiny'));

//parse request to body-parser
app.use(bodyParser.urlencoded({extended:true}));

//method to connect the database
connectDB();


//set view engine
app.set("view engine","ejs")

//loading all the assets
app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))
//app.use('/dist',express.static(path.resolve(__dirname,"assets/dist")))
app.use('/images',express.static(path.resolve(__dirname,"assets/images")))
app.use('/fonts',express.static(path.resolve(__dirname,"assets/fonts")))
app.use('/vendor',express.static(path.resolve(__dirname,"assets/vendor")))
//loading assets and route
app.use('/',require("./server/routes/router"))

app.listen(PORT,()=>{


    console.log('server is running on http://localhost:',PORT)

});
