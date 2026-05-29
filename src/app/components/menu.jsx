"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import SearchBar from "./searchbar";

export default function Menu() {

    const [product, setProduct] = useState([])
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        const url = searchQuery
            ? `/api/products/search?query=${encodeURIComponent(searchQuery)}`
            : "/api/products";

        fetch(url)
            .then(res => res.json())
            .then(data => setProduct(data.products || []))
            .catch(err => console.error("Error fetching products:", err));
    }, [searchQuery]);

    return (
        <section className="w-full max-w-6xl px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-gray-50">
                {product.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                    >
                        <div className="flex flex-col items-center">
                            <div className="overflow-hidden rounded-xl w-full h-48 bg-gray-50 flex items-center justify-center mb-6 relative">
                                <img
                                    className="animate-zoom-in max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    src={item.image}
                                    alt={item.name}
                                    width={640} height={480} />
                            </div>

                            <div className="text-center w-full">
                                {/* <span className="inline-block text-xs font-semibold text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full mb-3">
                                    {item.category}
                                </span> */}
                                <h2 className="font-bold text-2xl text-gray-800 mb-0 truncate px-2">
                                    {item.name}
                                </h2>
                                <p className="text-gray-500 text-sm mb-2 line-clamp-2 h-10 px-4">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <h3 className="text-2xl font-extrabold text-orange-500 mb-4">
                                ₹{item.price}
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/checkout">
                                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-300 shadow-md shadow-orange-500/10 cursor-pointer">
                                        Buy Now
                                    </button>
                                </Link>
                                <AddToCartButton product={item} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}