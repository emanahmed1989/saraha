import { connectDB } from './DB/connection.js';
import {messageRouter,userRouter,authRouter} from './Modules/index.js';
import fs from 'fs'
import cors from 'cors';

export function bootsrtap(app,express){
    app.use(express.json());
    app.use("/uploads",express.static("uploads"));
    app.use(cors({
        origin:"*"
    }));
    app.use('/auth',authRouter);
    app.use('/user',userRouter);
    app.use('/message',messageRouter);
     //global error handler
    app.use((error,req,res,next)=>{
        //roll back file uploading in case of uploading service fail
        if(req.file){
            fs.unlinkSync(req.file.path);
        }
        res.status(error.cause||500).json({message:error.message,success:false,stack:error.stack})
     })
    connectDB();

   

}



