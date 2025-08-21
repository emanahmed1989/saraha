import { User } from "../DB/model/user.model.js";
import { verifyToken } from "../Utilities/Token/index.js";

export const isAuthonticated=async(req,res,next)=>{
    
    const token = req.headers.authorization;
    if(!token){
    throw new Error('token is required',{cause:401})}
     const { id ,iat} = verifyToken(token);
     
     
     const issuedAtMs = iat * 1000; // convert seconds → ms
     const issuedAtDate = new Date(issuedAtMs);
     if (!id) {
        throw new Error('token is expired please log in again', { cause: 401 })
    }
    //check user existance ib DB
    const existUser=await User.findById(id);
      if (!existUser) {
        throw new Error('user not found', { cause: 404 })
    }
    // console.log( existUser.changepasswordAt);
    // console.log( issuedAtDate);
    
      if (existUser.changepasswordAt && issuedAtDate < existUser.changepasswordAt) {
      throw new Error(' token is no longer valid (password changed)');
    }
    req.user=existUser;
    return next();
}