import { Router } from "express";
import * as userService from './user.service.js';
import { fileUpload } from "../../Utilities/multer/multer.local.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { changePasswordSchema } from "./user.validation.js";
import { validateFilemiddleware } from "../../middleware/fileValidation.middleware.js";
import { isAuthonticated } from "../../middleware/auth.middleware.js";
import { fileUpload as fileUploadCloud } from "../../Utilities/multer/multer.cloud.js";
const router = Router();
router.delete('/delete', isAuthonticated, userService.deleteUser);
router.post('/change-password', isAuthonticated, isValid(changePasswordSchema), userService.changePassword);
router.post('/upload-profile-picture', isAuthonticated, fileUpload({ folder: 'profilePic' }).single('profilePic'), validateFilemiddleware(), userService.uploadProfilepicture);
router.post('/upload-profilePic-cloud', isAuthonticated //req.user
    , fileUploadCloud().single('profilePic')//req.file
    , validateFilemiddleware(), userService.uploadProfilepictureCloud);
router.get('/refreshToken', isAuthonticated, userService.refreshToken);
export default router;