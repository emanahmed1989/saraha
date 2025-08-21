export const isValid=(schema)=>{
    return (req,res,next)=>{
    const {value,error}=schema.validate(req.body,{abortEarly:false});
    if(error){
       let errMessage=error.details.map((err)=>{
            return err.message
        });
        errMessage=errMessage.join(', ');
        throw new Error(errMessage,{cause:400});
        
    }
    next();
}
}
