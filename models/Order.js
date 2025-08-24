import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    address: String,
    city: String,
    zip: String,
    paymentMethod: String,
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      default: "Pending", // Pending | Processing | Delivered
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
