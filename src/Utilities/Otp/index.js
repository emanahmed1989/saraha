/**

 * 
 * @param {*} expiredDuration //in milli seconds
 * @returns //object {otp,otpExpired}
 */
import  bcrypt  from 'bcrypt';
export  const generateOtp=(expiredDuration=15*60*1000)=>{
     const otp=Math.floor(Math.random()*90000+10000);
     const otpExpire =Date.now()+(expiredDuration);
     const hashOtp=bcrypt.hashSync(otp.toString(), 10)
     return{otp,hashOtp,otpExpire};
}