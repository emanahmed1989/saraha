
import jwt from 'jsonwebtoken';

export const verifyToken=(token,signiture='ghgfhfhgghjghghgh')=>{
return jwt.verify(token,signiture);   
}