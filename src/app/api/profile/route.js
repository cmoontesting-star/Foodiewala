import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import DBConnection from "@/app/utils/config/db";
import User from "@/app/utils/models/User";

/**
 * GET Handler - Retrieves the profile of the currently logged-in user.
 */
export async function GET(request) {
    try {
        await DBConnection();

        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        const user = await User.findOne({ email: session.user.email }).select("-password");
        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "user",
                image: user.image || ""
            }
        });
    } catch (error) {
        console.error("Error in GET /api/profile:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch profile." },
            { status: 500 }
        );
    }
}

/**
 * PUT Handler - Updates the profile (name and email) of the currently logged-in user.
 */
export async function PUT(request) {
    try {
        await DBConnection();

        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        const currentEmail = session.user.email;
        const body = await request.json();
        const { name, email, image } = body;

        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: "Name is required." },
                { status: 400 }
            );
        }

        if (!email || !email.trim()) {
            return NextResponse.json(
                { error: "Email is required." },
                { status: 400 }
            );
        }

        // If email is being changed, ensure it's not already registered by another user
        if (email.toLowerCase() !== currentEmail.toLowerCase()) {
            const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
            if (existingUser) {
                return NextResponse.json(
                    { error: "Email is already registered by another user." },
                    { status: 400 }
                );
            }
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: currentEmail },
            { name: name.trim(), email: email.trim().toLowerCase(), image },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        console.log("User profile updated successfully in database via API route");

        return NextResponse.json({
            success: true,
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image || ""
            }
        });
    } catch (error) {
        console.error("Error in PUT /api/profile:", error);
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred while updating profile." },
            { status: 500 }
        );
    }
}
