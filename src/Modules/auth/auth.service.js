import { User } from "../../DB/model/user.model.js";
import bcrypt from 'bcrypt';
import { sendmail } from "../../Utilities/Emails/index.js";
import { generateOtp } from "../../Utilities/Otp/index.js";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';



export const register = async (req, res, next) => {

    const { fullName, email, phoneNumber, dob, password } = req.body;

    const existUser = await User.findOne({
        $or: [
            {
                $and: [
                    { email: email }, { email: { $ne: null } }, { email: { $exists: true } }]
            }, { $and: [{ phoneNumber: phoneNumber }, { phoneNumber: { $ne: null } }, { phoneNumber: { $exists: true } }] }]
    });
    if (existUser) {
        throw new Error('user is already exist', { cause: 409 })
    }
    const user = new User({
        fullName,
        password: bcrypt.hashSync(password, 10),
        email,
        phoneNumber,
        dob
    });
    //generateotp
    //make expire duration 2 minutes
    const {otp,hashOtp, otpExpire } = generateOtp(2 * 60 * 1000);
    //update user
    user.otp = hashOtp;
    user.otpExpire = otpExpire;
    //sendmail
    if (email) {
        await sendmail({
            to: email,
            subject: 'verify your account',
            html: `<p>your otp to verify your account in saraha app is ${otp}<p/>`
        });
    }

    await user.save();
    return res.status(201).json({ message: 'user created successfully', success: true })
}


export const verifyAccount = async (req, res, next) => {

    //get data from body 
    const { email, otp } = req.body;
    //get user with same mail and otp
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('no user found with that email', { cause: 401 });
    }
    if (!bcrypt.compareSync(otp,user.otp)) {
        user.failedAttempts ++ ;
        if( user.failedAttempts==5){
        user.failedAttemptsExpire=Date.now()+5*60*1000;
        }
        await user.save();
        throw new Error('invalid otp', { cause: 401 });
    }
    if( user.otpExpire < Date.now()){
       throw new Error('invalid otp', { cause: 401 });
    }
    //get user with same  and otp
    // const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });
    // if (!user) {

    //     throw new Error('invalid otp', { cause: 401 });
    // }
    //set verified to true>>updateUser
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    user.failedAttempts = 0;
    user.failedAttemptsExpire = undefined;
    await user.save();
    //send response
    return res.status(200).json({ message: 'user is verified', success: true });


}
export const resendOtp = async (req, res, next) => {

    //get data from req
    const { email } = req.body;
    //get user 
    const existUser = await User.findOne({ email });
    if (!existUser) {
        throw new Error('user not found', { cause: 404 });
    }
    if(existUser.failedAttempts>=5&&existUser.failedAttemptsExpire>Date.now()){
         throw new Error('you are banned from requesting new code', { cause: 404 });
    }
    if(existUser.failedAttemptsExpire<Date.now()){
      existUser.failedAttempts=0;
      existUser.failedAttemptsExpire = undefined;  
    }
    //generata otp
    const {otp,hashOtp, otpExpire } = generateOtp(2*60*1000);

    //update user
    existUser.otp = hashOtp;
    existUser.otpExpire = otpExpire;
    existUser.failedAttempts=0;
    existUser.failedAttemptsExpire = undefined;  
    await existUser.save();
    //send mail
    sendmail({
        to: email,
        subject: 'resend OTP',
        html: `<p>your new otp is ${otp}</p>`
    });
    //send response
    return res.status(200).json({ message: 'new otp is sent to your email', success: true })


}
export const login = async (req, res, next) => {

    //get a from body
    const { email, password, phoneNumber } = req.body;
    //check user existance
    const existUser = await User.findOne({
        $or: [
            {
                $and: [
                    { email: email }, { email: { $ne: null } }, { email: { $exists: true } }]
            }, {
                $and: [
                    { phoneNumber: phoneNumber }, { phoneNumber: { $ne: null } }, { phoneNumber: { $exists: true } }]
            }]
    });

    if (!existUser) {
        throw new Error('invalid credentials', { cause: 401 });
    }
    if (existUser.isVerified == false) {
        throw new Error('verify account first', { cause: 400 });
    }
    //compare passwords
    if (!bcrypt.compareSync(password, existUser.password)) {
        throw new Error('invalid credentials', { cause: 401 });
    }
    //generate token
    const token = jwt.sign({ id: existUser._id, name: existUser.fullName }, "ghgfhfhgghjghghgh", { expiresIn: '15m' })
    //return response
    res.status(200).json({ message: 'user login successfully', success: true, data: token });


}
//need to be tested after downloading front end
//my generated client id =681160720673-4vglsi7ikm5rb79h3antp23v7u5nr763.apps.googleusercontent.com
export const googleLogin = async (req, res, next) => {

    //get data from front end req 
    const clientId = '681160720673-4vglsi7ikm5rb79h3antp23v7u5nr763.apps.googleusercontent.com';
    const { idToken } = req.body;
    //check that the id token from front end has the same client id of app
    const client = new OAuth2Client(clientId);
    const loginTicket = await client.verifyIdToken({ idToken });
    const payLoad = loginTicket.getPayload();
    //check user existance 
    let existUser = await User.findOne({ email: payLoad.email });
    //if not exist create new user 
    if (!existUser) {
        existUser = await User.create({
            fullName: payLoad.name,
            email: payLoad.email,
            phoneNumber: payLoad.phone,
            dob: payLoad.birthDate,
            isVerified: true,
            userAgent: 'google'
        });
    }
    //generate token 
    const token = jwt.sign({ id: existUser._id, name: existUser.fullName }, "ghgfhfhgghjghghgh", { expiresIn: '15m' })
    return res.status(200).json({ message: 'user login successfully', success: true, data: token })
    //

}

