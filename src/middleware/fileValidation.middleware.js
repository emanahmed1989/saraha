import { fileTypeFromBuffer } from "file-type";
import fs from "fs";


export const validateFilemiddleware=(allowedTypes=['image/png','image/jpeg','image/webp'])=>{
    return async(req,res,next)=>{ 
    const filePath=req.file.path;
    const buffer=fs.readFileSync(filePath);
     // get the file type
    const type = await fileTypeFromBuffer(buffer);
  
    if(!type||!allowedTypes.includes(type.mime)){
       return next(new Error('invalid file format'));
    }
    return next();
}
}