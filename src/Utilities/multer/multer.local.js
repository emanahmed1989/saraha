import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from 'fs';




export function fileUpload({folder,allowedTypes=['image/png','image/jpeg','image/webp']}={}) {
    const storage = diskStorage({
        destination: (req,file,cb)=>{
            const dest=`uploads/${req.user._id}/${folder}`
            fs.mkdirSync(dest,{recursive:true});
            cb(null,dest)
        },
        filename: (req, file, cb) => {
            // if(file.mimetype=='application/pdf'){
            //     cb(new Error('invalid mime type',{cause:400}));//global error handler

            cb(null,nanoid(5)+'_'+file.originalname);

        }
    });
    const fileFilter=(req,file,cb)=>{
        if(allowedTypes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb( new Error('invalid file format',{cause:400}));
        }
    }
    return multer({ fileFilter,storage });
}