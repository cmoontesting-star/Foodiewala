// models/Order.js

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        productId: String,
        name: String,
        category: String,
        image: String,
        price: Number,
        quantity: Number,

        customerName: String,
        phone: String,
        address: String,

        status: {
            type: String,
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Order ||
    mongoose.model("Order", orderSchema);