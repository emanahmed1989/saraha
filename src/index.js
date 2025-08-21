import { bootsrtap } from "./app.controller.js";
import express from "express";

const app = express();
const port =process.env.PORT;
//to get port number from environment variable
//const myPort=process.env.port; // port is variable name that is defiend in the system 

app.listen(port,()=>{
    console.log('app is running at port',port);  
});

bootsrtap(app,express);