// app/api/cart/route.js

import { NextResponse } from "next/server";
import connectDB from "@/app/utils/config/db";
import Cart from "@/app/utils/models/Cart";


// ADD TO CART
export async function POST(req) {
    try {

        await connectDB();

        const body = await req.json();

        // CHECK PRODUCT ALREADY EXISTS
        const existingProduct = await Cart.findOne({
            productId: body.productId,
        });

        // UPDATE QUANTITY
        if (existingProduct) {

            existingProduct.quantity += 1;

            await existingProduct.save();

            return NextResponse.json({
                success: true,
                message: "Quantity Updated",
            });
        }

        // CREATE NEW CART ITEM
        await Cart.create(body);

        return NextResponse.json({
            success: true,
            message: "Added To Cart",
        });

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}

// GET CART ITEMS
export async function GET() {
    try {

        await connectDB();

        const cartItems = await Cart.find().sort({
            createdAt: -1,
        });

        return NextResponse.json({
            success: true,
            cartItems,
        });

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}

// DELETE CART ITEM / CLEAR CART
export async function DELETE(req) {
    try {

        await connectDB();

        const { searchParams } = new URL(req.url);

        const id = searchParams.get("id");

        if (id) {
            await Cart.findByIdAndDelete(id);
            return NextResponse.json({
                success: true,
                message: "Item Removed",
            });
        } else {
            await Cart.deleteMany({});
            return NextResponse.json({
                success: true,
                message: "Cart Cleared",
            });
        }

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}

// UPDATE QUANTITY
export async function PUT(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        let id = searchParams.get("id");
        const body = await req.json();

        if (!id) {
            id = body.id;
        }

        const action = body.action;

        const cartItem = await Cart.findById(id);
        if (!cartItem) {
            return NextResponse.json(
                { success: false, message: "Item not found" },
                { status: 404 }
            );
        }

        if (action === "increase") {
            cartItem.quantity += 1;
        } else if (action === "decrease") {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                await Cart.findByIdAndDelete(id);
                return NextResponse.json({
                    success: true,
                    message: "Item removed from cart",
                });
            }
        }

        await cartItem.save();

        return NextResponse.json({
            success: true,
            message: "Quantity Updated",
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}