import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from 'fs';




export function fileUpload({allowedTypes=['image/png','image/jpeg','image/webp']}={}) {
    //upload file by default in temp folder and give to file random name
    const storage = diskStorage({});
    const fileFilter=(req,file,cb)=>{
        if(allowedTypes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb( new Error('invalid file format',{cause:400}));
        }
    }
    return multer({ fileFilter,storage });
}