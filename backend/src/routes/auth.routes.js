import express from 'express';
import { checkAadhaar, sendOtp, verifyOtp, registerCitizen, loginOfficer, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/check-aadhaar', checkAadhaar);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerCitizen);
router.post('/officer-login', loginOfficer);
router.get('/me', authenticate, getCurrentUser);

export default router;
