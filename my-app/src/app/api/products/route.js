import Product from "../../utils/models/product"
import connectDB from "../../utils/config/db"
import { NextResponse } from "next/server"



export async function GET(req) {

    await connectDB()

    const products = await Product.find()

    return NextResponse.json({ products })
}

export async function POST(req) {

    await connectDB()

    try {
        const contentType = req.headers.get("content-type") || ""
        let name, price, description, category, imageUrl = ""

        if (contentType.includes("multipart/form-data")) {
            const data = await req.formData()
            name = data.get("name")
            price = data.get("price")
            description = data.get("description")
            // category = data.get("category")
            const file = data.get("image")

            if (file && typeof file !== "string" && file.name) {
                const bytes = await file.arrayBuffer()
                const buffer = Buffer.from(bytes)

                const path = require("path")
                const fs = require("fs")
                const uploadDir = path.join(process.cwd(), "public", "uploads")
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true })
                }

                const filename = Date.now() + "_" + file.name.replace(/\s+/g, "_")
                const filePath = path.join(uploadDir, filename)
                fs.writeFileSync(filePath, buffer)
                imageUrl = `/uploads/${filename}`
            } else {
                imageUrl = file || ""
            }
        } else {
            const body = await req.json()
            name = body.name
            price = body.price
            description = body.description
            // category = body.category
            imageUrl = body.image
        }

        const product = await Product.create({
            name,
            price: Number(price),
            description: description || "Tasty food item",
            // category: category || "General",
            image: imageUrl || "/Assests/biryani.png"
        })

        return NextResponse.json({ success: true, product })
    } catch (error) {
        console.error("Error in product creation:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(req) {

    await connectDB()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    await Product.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
}