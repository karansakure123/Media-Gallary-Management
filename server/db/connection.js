import  mongoose from  'mongoose';
 
   const  connectMongoose= async()=>{
     mongoose.connect("mongodb://localhost:27017/mydb2")
     .then( console.log('mongodb connected succesfully '))
     .catch((e)=>{ console.log("error to connect db", error);
     });
 }
export default connectMongoose;