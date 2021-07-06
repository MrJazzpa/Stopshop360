const Stopshop360 = require('../model/model');
var shop360 = require('../model/model');
const bcrypt= require("bcrypt");
const nodemailer = require('nodemailer');
const { response } = require('express');
const session = require('express-session');


 // creating a mail function

 var transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {

        user: 'wizzyjazzpa4blinks@gmail.com',
        pass: 'Wizzyjazzpa@1'
    }
 });


 exports.User_Registration= async(req,res)=>{

    if(!req.body)
    {

       res.send.json({status:400, message:" empty"})
        return;
    }
    const salt = await bcrypt.genSalt(10);
     encrypt_password= await bcrypt.hash(req.body.password,salt);
     var verify_code = Math.floor(1000 + Math.random() * 9000);
     var mailOptions ={

        from: 'wizzyjazzpa4blinks@gmail.com',
        to: req.body.email,
        subject: 'Welcome',
        text: 'Hello! ' +req.body.lastname+'\n'+ 'welcome to Stopshop360 \n' + " your Verification code is:"+ verify_code
     }
    const register = new Stopshop360({

        email : req.body.email,
        password : encrypt_password,
        firstname:req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        verification_code : verify_code
    });
    register
    .save(register)
    .then(data=>{
        console.log(data);
        
        transporter.sendMail(mailOptions,function(error,info){

            if(error){
                 console.log(error)
                 res.json({status:400, message:error})
            }
            else{
               
              res.json({ status:200,message:"success"});
               
            }

        })
        
    return;
    }).catch(err=>{
      
        //var msg="Email already exists";
       res.json({status:500, message: err.message});
    

    });

 }

// inserting data to the database
 


//userlogin
exports.userlogin =(req,res)=>{

    const email=req.query.email;
    const pass = req.query.password;
    
    shop360.findOne({email:email})
    
    .then(data=>{
        if(!data){
            res.json({ status:400,message:"email not found"});
        }
        else{


            //const validatepassword= bcrypt.compare(pass,data.password);
             bcrypt.compare(pass, data.password, function(err, isMatch) {
                if (err) {
                  throw err
                } else if (!isMatch) {
                    
                    res.json({status:404, message:"password is incorrerct"});
                    console.log("Password doesn't match!")
                } 
                else {
                    req.session.getemail=data.email;
                    res.json({
                        status:200,
                        message: "Login successfull",
                        getSession : req.session.getemail
                     });
                     
                  console.log("Password matches!")
                }
              })

        }


    })
    .catch(error=>{

           res.json({status:500,message:error.message});
    })

}

exports.getusers=(req,res)=>{
   
    shop360.find()
    .then(register=>{


        res.json({message:register, status:200});
    })
    .catch(err=>{
        res.status(500).send({message: err.message || "error occured while performing search operation"});
    });

    
}

exports.email_verification=(req,res)=>{
    
     const verify_code=req.query.verification_code;
      shop360.findOne({verification_code:verify_code})
      .then(data=>{
        if(!data){
            res.json({ status:400,message:"not fund"});
        }
        else{
            res.json({
                Email:data.email,
                verification_code:data.verification_code,
                status:200
            })
          
        }
        //res.redirect('/dashboard');
      })
      .catch(err=>{
        res.status(500).send({message: "error retrieving user"})

  })
    

    
   
}