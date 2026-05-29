// app/api/orders/route.js

import { NextResponse } from "next/server";
import connectDB from "@/app/utils/config/db";
import Order from "@/app/utils/models/Order";

// GET ORDERS
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const order = await Order.findById(id);
      if (!order) {
        return NextResponse.json({
          success: false,
          message: "Order not found",
        }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        order,
      });
    }

    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

// BUY NOW / PLACE ORDER
export async function POST(req) {

    try {

        await connectDB();

        const body = await req.json();

        const order = await Order.create({
            productId: body.productId,
            name: body.name,
            category: body.category,
            image: body.image,
            price: body.price,
            quantity: body.quantity,

            customerName: body.customerName,
            phone: body.phone,
            address: body.address,
        });

        return NextResponse.json({
            success: true,
            message: "Order Placed Successfully",
            order,
        });

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}