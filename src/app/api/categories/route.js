// app/api/categories/route.js

import { NextResponse } from "next/server";
import connectDB from "@/app/utils/config/db";
import Category from "@/app/utils/models/Category";


// ADD CATEGORY
export async function POST(req) {
    try {
        await connectDB();

        const { name } = await req.json();

        const newCategory = await Category.create({ name });

        return NextResponse.json({
            success: true,
            message: "Category Added Successfully",
            category: newCategory,
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

// GET CATEGORIES
export async function GET() {
    try {
        await connectDB();

        const categories = await Category.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            categories,
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

// DELETE CATEGORY
export async function DELETE(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Category ID is required" },
                { status: 400 }
            );
        }

        await Category.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Category Deleted Successfully",
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