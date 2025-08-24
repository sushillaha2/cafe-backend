import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import cartRoutes from './routes/CartRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import subscribeRoute from './routes/subscribeRoute.js';
import contactRoute from "./routes/ContactRoute.js";
import placeOrderRoutes from './routes/placeOrderRoutes.js';

import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscribe', subscribeRoute);
app.use("/api/contact", contactRoute);
app.use("/api/orders", placeOrderRoutes);
app.use("/api/admin", adminRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('☕ Coffee Backend Server is Running...');
});



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err);
  });
