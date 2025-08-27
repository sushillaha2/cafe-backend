// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import nodemailer from "nodemailer";

// // ============================
// //  Controller: User Signup
// // ============================
// export const signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     //  Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     //  Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     //  Save user in DB (🔹 Role added here)
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: email === process.env.ADMIN_EMAIL ? "admin" : "customer", //    Hardcoded role
//     });
//     await newUser.save();

//     //  JWT token
//     const token = jwt.sign(
//       { id: newUser._id, role: newUser.role }, //    role bhi token me bhejna zaroori hai
//       process.env.JWT_SECRET,
//       { expiresIn: "3d" }
//     );

//     // ============================
//     //  Send Emails (Nodemailer)
//     // ============================
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     //    Mail to User (Welcome mail)
//     const userMailOptions = {
//       from: `"Bean Scene Support" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Welcome to Bean Scene ☕",
//       text: `
// Hello ${name},

// Welcome to Bean Scene Coffee!  
// Your account has been created successfully.  

// Enjoy browsing our coffees and placing orders anytime!  

// Warm Regards,  
// Bean Scene Team ☕
//       `,
//     };

//     //    Mail to Admin (New user alert)
//     const adminMailOptions = {
//       from: `"Bean Scene Support" <${process.env.EMAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: "New User Signup Alert 📢",
//       text: `
// 📢 New User Registered!

// 👤 Name: ${name}  
// 📧 Email: ${email}  

// Check the admin dashboard for more details.
//       `,
//     };

//     //  Send mails (non-blocking)
//     transporter.sendMail(userMailOptions).catch(err =>
//       console.error("User mail error:", err)
//     );
//     transporter.sendMail(adminMailOptions).catch(err =>
//       console.error("Admin mail error:", err)
//     );

//     //    Response
//     res.status(201).json({
//       message: "Signup successful",
//       token,
//       user: {
//         _id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role, //    role response me bhi bhejna
//       },
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// // ============================
// // 🔖 Controller: User Login
// // ============================
// export const login = async (req, res) => {
//   try {
//     // 📥 Get email and password from request body
//     const { email, password } = req.body;

//     // 🔍 Check if user exists with given email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // 🔐 Compare input password with hashed password in DB
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // 🪪 Generate a JWT token valid for 3 days (   role include kiya)
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '3d' }
//     );

//     // 📤 Send success response with token and user info
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,   //    role response me bhi bheja
//       },
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };








// new code


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import otpStore from "../models/utils/otpStore.js";   

// ============================
// Controller: User Signup (direct signup without OTP)
// ============================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: email === process.env.ADMIN_EMAIL ? "admin" : "customer",
    });
    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// Controller: User Login
// ============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// Step 1: Send OTP (with validation)
// ============================
export const sendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields (name, email, password) are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store OTP and user data temporarily
    otpStore.set(email, {
      otp,
      data: { name, email, password: hashedPassword },
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: `"Bean Scene OTP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp} (valid for 5 minutes).`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({
      message: "Failed to send OTP",
      error: err.message, // helpful for debugging
    });
  }
};


// ============================
// Step 2: Verify OTP & Create Account
// ============================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // ✅ Input validation
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const stored = otpStore.get(email);
    if (!stored) {
      return res.status(400).json({ message: "No OTP found or expired" });
    }

    if (stored.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (stored.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const { name, password } = stored.data;

    const newUser = new User({
      name,
      email,
      password,
      role: email === process.env.ADMIN_EMAIL ? "admin" : "customer",
    });
    await newUser.save();

    // ✅ Remove OTP from store once used
    otpStore.delete(email);

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message, // helpful debugging
    });
  }
};
