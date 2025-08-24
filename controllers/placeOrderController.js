import nodemailer from "nodemailer";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";  

export const placeOrder = async (req, res) => {
  const { userId, name, email, address, city, zip, paymentMethod } = req.body;

  try {
    // 1. Cart fetch karo
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty." });
    }

    // 2. Items ko copy karo (cart clear hone se pehle)
    const orderItems = [...cart.items];

    // 3. Total calculate
    const total =
      cart.totalPrice ||
      orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 4. Order ko DB me save karo ✅
    const newOrder = new Order({
      userId,
      name,
      email,
      address,
      city,
      zip,
      paymentMethod,
      items: orderItems,
      total,
    });
    await newOrder.save();

    // 5. Cart clear kar do ✅
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // 6. Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 7. Order items list text bana lo
    const itemsText = orderItems
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.title} x ${i.quantity} = ₹${i.price * i.quantity}`
      )
      .join("\n");


    // 8. User email
    const userMail = {
      from: `"Bean Scene" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Order Confirmation - Bean Scene",
      text: `
Hello ${name},

Thank you for your order! 🎉

🧾 Order Summary:
---------------------
Name: ${name}
Email: ${email}
Address: ${address}, ${city} - ${zip}
Payment Method: ${paymentMethod}

📦 Items:
${itemsText}

💰 Total: ₹${total}

We’ll contact you shortly regarding delivery.

☕ Warm Regards,  
Bean Scene Team
      `,
    };

    // 9. Admin email
    const adminMail = {
      from: `"Bean Scene" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "📢 New Order Received - Bean Scene",
      text: `
New Order Received! 🚀

🧑 Customer Details:
---------------------
Name: ${name}
Email: ${email}
Address: ${address}, ${city} - ${zip}
Payment Method: ${paymentMethod}

📦 Items:
${itemsText}

💰 Total: ₹${total}

👉 Please process this order promptly.
      `,
    };

    // 10. Pehle client ko success response ✅
    res
      .status(200)
      .json({ success: true, message: "Order placed successfully!" });

    // 11. Background me email send
    try {
      await transporter.sendMail(userMail);
      await transporter.sendMail(adminMail);
      console.log("📧 Emails sent (user + admin).");
    } catch (err) {
      console.error("❌ Email sending failed:", err.message);
    }
  } catch (error) {
    console.error("❌ Order placement failed:", error);
    res
      .status(500)
      .json({ success: false, message: "Order placement failed." });
  }
};
