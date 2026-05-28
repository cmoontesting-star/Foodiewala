"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {

    const [cartItems, setCartItems] = useState([]);

    // FETCH CART ITEMS
    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (data.success) {
            setCartItems(data.cartItems);
        }
    };

    // REMOVE ITEM
    const removeItem = async (id) => {
        const res = await fetch(`/api/cart?id=${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
            fetchCartItems();
        }
    };

    // INCREASE QUANTITY
    const increaseQuantity = async (id) => {
        const res = await fetch(`/api/cart?id=${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                action: "increase",
            }),
        });
        const data = await res.json();
        if (data.success) {
            fetchCartItems();
        }
    };

    // DECREASE QUANTITY
    const decreaseQuantity = async (id) => {
        const res = await fetch(`/api/cart?id=${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                action: "decrease",
            }),
        });
        const data = await res.json();
        if (data.success) {
            fetchCartItems();
        }
    };

    // TOTAL PRICE
    const totalPrice = cartItems.reduce(
        (acc, item) =>
            acc + item.price * item.quantity,
        0
    );

    return (
        <div className="pb-20">
            <Navbar />

            <div className="max-w-[1200px] mx-auto mt-8">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shopping Cart</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {cartItems.length > 0
                                ? `You have ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in your cart`
                                : 'Your cart is currently empty'
                            }
                        </p>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto mt-10">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 text-amber-500 animate-pulse">
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm">
                            Looks like you haven't added anything to your cart yet. Go back to our menu to discover delicious foods!
                        </p>
                        <Link href="/" className="px-8 py-3.5 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-full shadow-lg shadow-yellow-600/20 transition-all duration-300 transform hover:-translate-y-0.5">
                            Explore Menu
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 gap-4">
                                    {/* Image & Product info */}
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-base sm:text-lg leading-tight">{item.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1 capitalize">{item.category}</p>
                                            <p className="text-yellow-600 font-bold mt-1 text-sm sm:text-base">₹{item.price}</p>
                                        </div>
                                    </div>

                                    {/* Actions (Quantity and Delete) */}
                                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                                        {/* Quantity selector pill */}
                                        <div className="flex items-center bg-gray-50 border border-gray-200/80 rounded-full px-2 py-1 select-none">
                                            <button
                                                onClick={() => decreaseQuantity(item._id)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-yellow-600 active:scale-95 transition-all shadow-sm border border-transparent hover:border-gray-100 cursor-pointer font-bold text-lg"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-semibold text-gray-700 text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => increaseQuantity(item._id)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-yellow-600 active:scale-95 transition-all shadow-sm border border-transparent hover:border-gray-100 cursor-pointer font-bold text-lg"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Subtotal for item */}
                                        <span className="font-bold text-gray-800 w-20 text-right">
                                            ₹{item.price * item.quantity}
                                        </span>

                                        {/* Remove button */}
                                        <button
                                            onClick={() => removeItem(item._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Panel */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 lg:sticky lg:top-24">
                                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-50 pb-4">Order Summary</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-gray-800">₹{totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Delivery Fee</span>
                                        {totalPrice > 500 ? (
                                            <span className="font-semibold text-green-500">Free</span>
                                        ) : (
                                            <span className="font-semibold text-gray-800">₹40</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>GST & Taxes (5%)</span>
                                        <span className="font-semibold text-gray-800">₹{Math.round(totalPrice * 0.05)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                                    <span className="text-gray-800 font-medium">Estimated Total</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ₹{totalPrice + (totalPrice > 500 ? 0 : 40) + Math.round(totalPrice * 0.05)}
                                    </span>
                                </div>

                                {/* Promo Code Option */}
                                <div className="pt-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Promo Code"
                                            className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
                                        />
                                        <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                                <Link href="/checkout" >
                                    <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-yellow-600/10 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer">
                                        Proceed to Checkout
                                        <ArrowRight size={18} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}