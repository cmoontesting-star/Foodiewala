import { NextResponse } from "next/server";

import connectDB from "@/app/utils/config/db";
import Product from "@/app/utils/models/product";

export async function GET(req) {

    try {

        await connectDB();

        const { searchParams } =
            new URL(req.url);

        const query =
            searchParams.get("query");

        // SEARCH PRODUCTS
        const products =
            await Product.find({

                name: {
                    $regex: query,
                    $options: "i",
                },
            });

        return NextResponse.json({
            success: true,
            products,
        });

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}