const mongoose = require("mongoose");
const connectDB=async()=>{

     try{

        const con = await mongoose.connect(process.env.MONGO_URI,{


            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCreateIndex:true
        })
        console.log('MongoDB connect:',con.connection.host);


     }catch(err){

        console.log(err);
        process.exit(1);
     }

}
/*var MongoClient = require('mongodb').MongoClient;
//mydb is the new database we want to create
var url = "mongodb://localhost:27017/mydb";
//make client connect 
MongoClient.connect(url, function (err, client) {
    var db = client.db('mydb');
    if (err) throw err;
    //customers is a collection we  want to create                             
    db.createCollection("customers", function (err, result) {
        if (err) throw err;
        console.log("database and Collection created!");
        client.close();
    });
});*/
module.exports = connectDB;