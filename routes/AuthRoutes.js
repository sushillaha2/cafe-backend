import express from 'express';
import { signup, login } from '../controllers/authController.js'; // Logic for signup/login

//  Create a router instance
const router = express.Router();

// ===========================
//  Auth Routes
// ===========================

//  Route for user signup (POST request)
router.post('/signup', signup);

//  Route for user login (POST request)
router.post('/login', login);

//  Export the router to be used in the main app
export default router;
