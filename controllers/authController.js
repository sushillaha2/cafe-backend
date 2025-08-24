import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";

// ============================
//  Controller: User Signup
// ============================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //  Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Save user in DB (🔹 Role added here)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: email === process.env.ADMIN_EMAIL ? "admin" : "customer", //    Hardcoded role
    });
    await newUser.save();

    //  JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role }, //    role bhi token me bhejna zaroori hai
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // ============================
    //  Send Emails (Nodemailer)
    // ============================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //    Mail to User (Welcome mail)
    const userMailOptions = {
      from: `"Bean Scene Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Bean Scene ☕",
      text: `
Hello ${name},

Welcome to Bean Scene Coffee!  
Your account has been created successfully.  

Enjoy browsing our coffees and placing orders anytime!  

Warm Regards,  
Bean Scene Team ☕
      `,
    };

    //    Mail to Admin (New user alert)
    const adminMailOptions = {
      from: `"Bean Scene Support" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New User Signup Alert 📢",
      text: `
📢 New User Registered!

👤 Name: ${name}  
📧 Email: ${email}  

Check the admin dashboard for more details.
      `,
    };

    //  Send mails (non-blocking)
    transporter.sendMail(userMailOptions).catch(err =>
      console.error("User mail error:", err)
    );
    transporter.sendMail(adminMailOptions).catch(err =>
      console.error("Admin mail error:", err)
    );

    //    Response
    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role, //    role response me bhi bhejna
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// ============================
// 🔖 Controller: User Login
// ============================
export const login = async (req, res) => {
  try {
    // 📥 Get email and password from request body
    const { email, password } = req.body;

    // 🔍 Check if user exists with given email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 🔐 Compare input password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 🪪 Generate a JWT token valid for 3 days (   role include kiya)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    // 📤 Send success response with token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,   //    role response me bhi bheja
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
