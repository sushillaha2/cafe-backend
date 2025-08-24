import Subscribe from "../models/Subscribe.js";
import nodemailer from "nodemailer";

export const handleSubscribe = async (req, res) => {
  const { email } = req.body;

  try {
    // ✅ Check if already subscribed
    const exists = await Subscribe.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "Already subscribed" });
    }

    // ✅ Save to DB
    const newSub = new Subscribe({ email });
    await newSub.save();

    // ✅ Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Mail options
    const userMailOptions = {
      from: `"Bean Scene Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for Subscribing - Bean Scene ☕",
      text: `
Hello,

Thank you for subscribing to Bean Scene Coffee!  
You'll now receive updates about our latest offers and news.  

Warm Regards,  
Bean Scene Team ☕
      `,
    };

    const adminMailOptions = {
      from: `"Bean Scene Support" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Subscriber Alert 📢",
      text: `
📢 New Subscriber Alert!

A new user has subscribed to the newsletter.  

📧 Email: ${email}

Please add them to your mailing list.
      `,
    };

    // ✅ Send emails in background (non-blocking)
    transporter.sendMail(userMailOptions).catch(err => console.error("User mail error:", err));
    transporter.sendMail(adminMailOptions).catch(err => console.error("Admin mail error:", err));

    // ✅ Immediate response (fast UX)
    return res.status(201).json({ success: true, message: "Subscribed successfully" });

  } catch (err) {
    console.error("❌ Subscription Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
