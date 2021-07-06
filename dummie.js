
exports.create= async(req,res)=>{

    if(!req.body)
    {

        res.status(400).send({message:" content cannot be empty"});
        return;
    }
    // encrypting password
    const salt = await bcrypt.genSalt(10);
     encrypt_password= await bcrypt.hash(req.body.password,salt);
     var mailOptions ={

        from: 'wizzyjazzpa4blinks@gmail.com',
        to: req.body.email,
        subject: 'Welcome',
        text: 'Hello! ' +req.body.lastname+'/n'+'welcome to Stopshop360'
     }
    const register = new Stopshop360({

        email : req.body.email,
        password : encrypt_password,
        firstname:req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone
    });

    
}


const email=req.query.email;
const pass = req.query.password;
shop360.findOne({email:email})
.then(data=>{
    if(!data){
        res.json({ status:400,message:"email not found"});
    }
    else{


        const validatepassword= await bcrypt.compare(pass,data.password);
        if(validatepassword)
         {

            res.json({
              status:200,
              message: "Login successfull"
           });

         }
         else{
               res.json({status:404, message:"password is incorrerct"});
         }

    }


})
.catch(error=>{

       res.json({status:500,message:error.message});
})
