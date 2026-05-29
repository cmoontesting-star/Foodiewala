"use client";

import { useState } from "react";
import { ShoppingCart, Loader2, Check } from "lucide-react";

export default function AddToCartButton({ product }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const addToCart = async (e) => {
        e.preventDefault(); // Prevent any parent link redirection
        setLoading(true);
        setSuccess(false);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: product._id,
                    name: product.name,
                    category: product.category || "General",
                    image: product.image,
                    price: product.price,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                // Clear success state after 2 seconds
                setTimeout(() => setSuccess(false), 2000);
            } else {
                alert(data.message || "Failed to add to cart");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Error adding to cart");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={addToCart}
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                success 
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-green-500/10" 
                    : "bg-black hover:bg-gray-800 text-white shadow-black/10"
            }`}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                </>
            ) : success ? (
                <>
                    <Check className="w-4 h-4" />
                    Added!
                </>
            ) : (
                <>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                </>
            )}
        </button>
    );
}
