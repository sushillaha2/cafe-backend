import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    role: {
      type: String,
      enum: ["customer", "admin"],   //  ab sirf customer & admin
      default: "customer"            //  default customer hoga
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active"              //  extra useful admin panel ke liye
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
