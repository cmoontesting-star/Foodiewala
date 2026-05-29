import { NextResponse } from "next/server";
import DBConnection from "@/app/utils/config/db";
import User from "@/app/utils/models/User";

export async function GET(request) {
    try {
        await DBConnection();
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "user",
                createdAt: user.createdAt || user.updatedAt || new Date().toISOString()
            }))
        });
    } catch (error) {
        console.error("Error in GET /api/admin/users:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch users list." },
            { status: 500 }
        );
    }
}
