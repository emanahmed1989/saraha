import { User } from "../../DB/model/user.model.js";
import fs from 'fs';
import bcrypt from 'bcrypt';
import { verifyToken } from "../../Utilities/Token/index.js";
import jwt from 'jsonwebtoken';
import cloudinary from "../../Utilities/cloud/cloudinary.config.js";

export const deleteUser = async (req, res, next) => {

    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
        throw new Error('user not found', { cause: 404 })
    }
    res.status(200).json({ message: 'user deleted successfully', success: true })


}
export const uploadProfilepicture = async (req, res, next) => {
    //delete old profile pic
     if(req.user.profilePic){
        fs.unlinkSync(req.user.profilePic);
     }
     //update user to set profile pic with the new path
    const user = await User.findByIdAndUpdate(req.user._id, { profilePic: req.file.path }, { new: true });
    if (!user) {
        throw new Error('user is not exist', { cause: 404 })
    }
    res.status(200).json({ message: 'profilepic is uploaded successfully', success: true, data: user })
}
export const uploadProfilepictureCloud = async (req, res, next) => {
    //get user data from auth middleware
    const user=req.user;
    //get file data from multer
    const file = req.file;
    //delete old pic from cloud
    // if(user.cloudprofilePic.public_id){
    //     await cloudinary.uploader.destroy(user.cloudprofilePic.public_id)
    // }
    //upload file in cloud
    const {public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{
        folder:user.cloudprofilePic?.public_id?'':`saraha/users/${user._id}/profile-pic` ,//create folder in cloud
        public_id:user.cloudprofilePic?.public_id?user.cloudprofilePic.public_id:'' //replace new public id with old one so it will overwite old image and don't need to destroy old one
    })
    //store in DB
    await User.updateOne({_id:user._id},{cloudprofilePic:{public_id,secure_url}})
    //reponse
    return res.status(200).json({ message: 'profilepic is uploaded successfully', success: true, data: {public_id,secure_url} })
}
export const changePassword = async (req, res, next) => {

    const existUser = req.user;

    const { oldPassword, newPassword } = req.body;// from auth middleware
    //  Validate old password
    const checkOldPass = bcrypt.compareSync(oldPassword, existUser.password);

    if (!checkOldPass) {
        throw new Error('old password is wrong please enter correct one', { cause: 401 })
    }
    //  Prevent using the same password again
    if (oldPassword === newPassword) {
        throw new Error('New password must not be the same as any of your recent passwords', { cause: 400 })
    }
    await existUser.updateOne({
        password: bcrypt.hashSync(newPassword, 10),
        changepasswordAt: new Date()
    });


    //generate token
    const token = jwt.sign({ id: existUser._id, name: existUser.fullName }, "ghgfhfhgghjghghgh", { expiresIn: '15m' });
    res.status(200).json({
        message: 'password is changed successfully', success: true, data: {
            token
        }
    })
}

export const refreshToken = async (req, res, next) => {
    const existUser = req.user;

    //generate refresh token
    const refreshToken = jwt.sign(
        { id: existUser._id },
        "ghgfhfhgghjghghgh",
        { expiresIn: '7d' }
    );
    //send response
        res.status(200).json({
        message: 'token  is renewed successfully', success: true, data: {
            refreshToken
        }
    })

}
