import mongoose from "mongoose";

export function connectDB(){
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log('database is connected successfully');
        
    }).catch((error)=>{
        console.log('failed to connect to data base');
        
    })
}