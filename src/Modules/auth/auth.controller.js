import { Router } from "express";
import * as authService from "./auth.service.js";
import { isValid } from './../../middleware/validation.middleware.js';
import { registerSchema } from "./auth.validation.js";
const router =Router();

router.post('/register',isValid(registerSchema),authService.register);
router.post('/login',authService.login);
router.post('/verify-account',authService.verifyAccount);
router.post('/resend-otp',authService.resendOtp);
router.post('/google-login',authService.googleLogin);
export default router;