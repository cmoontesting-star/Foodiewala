import { NextResponse } from "next/server";

import connectDB from "@/utils/db";

import Notification from "@/models/Notification";

/* GET NOTIFICATIONS */
export async function GET() {

    try {

        await connectDB();

        const notifications =
            await Notification.find()
                .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            notifications,
        });

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}

/* CREATE NOTIFICATION */
export async function POST(req) {

    try {

        await connectDB();

        const body = await req.json();

        const notification =
            await Notification.create(body);

        return NextResponse.json({
            success: true,
            notification,
        });

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}