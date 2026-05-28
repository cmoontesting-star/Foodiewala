// models/Cart.js

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },


        price: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;