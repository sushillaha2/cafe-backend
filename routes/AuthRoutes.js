// import express from 'express';
// import { signup, login } from '../controllers/authController.js'; // Logic for signup/login

// //  Create a router instance
// const router = express.Router();

// // ===========================
// //  Auth Routes
// // ===========================

// //  Route for user signup (POST request)
// router.post('/signup', signup);

// //  Route for user login (POST request)
// router.post('/login', login);

// //  Export the router to be used in the main app
// export default router;



// new code 

import express from 'express';
import { signup, login, sendOtp, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

// Old routes
router.post('/signup', signup);
router.post('/login', login);

// New OTP routes
router.post('/send-otp', sendOtp);       // Step 1: Send OTP
router.post('/verify-otp', verifyOtp);   // Step 2: Verify OTP

export default router;
