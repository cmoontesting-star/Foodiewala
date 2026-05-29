// app/components/BuyNowButton.js

"use client";

import { useRouter } from "next/navigation";

export default function BuyNowButton({ product }) {

    const router = useRouter();

    const handleBuyNow = () => {

        // REDIRECT TO CHECKOUT PAGE
        router.push(`/checkout/${product._id}`);
    };

    return (
        <button
            onClick={handleBuyNow}
            className="bg-orange-500 text-white px-5 py-2 rounded"
        >
            Buy Now
        </button>
    );
}