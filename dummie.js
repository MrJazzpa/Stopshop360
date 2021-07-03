
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


type:"POST",
            url: "/api/users/verification/",
            data:{
                verification_code:verification_code
            },
            success:function(data){

                if(data.status==200){
                    alert("worked");
                }
                else if(data.status==400){

                    alert("did not work");
                }
                else{

                    alert(data.message)
                }
            }



