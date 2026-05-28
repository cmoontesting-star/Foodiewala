"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Truck, MapPin, User, Phone, ClipboardCheck, Loader2 } from "lucide-react";

export default function CartCheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    
    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        address: "",
    });

    // FETCH CART ITEMS
    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const res = await fetch("/api/cart");
            const data = await res.json();
            if (data.success) {
                setCartItems(data.cartItems);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        } finally {
            setLoading(false);
        }
    };

    // HANDLE INPUTS
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // TOTAL PRICE
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const deliveryFee = totalPrice > 500 ? 0 : 40;
    const taxes = Math.round(totalPrice * 0.05);
    const finalTotal = totalPrice + deliveryFee + taxes;

    // PLACE ORDER
    const placeOrder = async (e) => {
        e.preventDefault();
        
        if (!formData.customerName.trim() || !formData.phone.trim() || !formData.address.trim()) {
            alert("Please fill in all the shipping details.");
            return;
        }

        setPlacingOrder(true);

        try {
            // Loop through each cart item and place an order
            const orderPromises = cartItems.map(item => 
                fetch("/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productId: item.productId,
                        name: item.name,
                        category: item.category,
                        image: item.image,
                        price: item.price,
                        quantity: item.quantity,

                        customerName: formData.customerName,
                        phone: formData.phone,
                        address: formData.address,
                    }),
                })
            );

            const responses = await Promise.all(orderPromises);
            const dataResults = await Promise.all(responses.map(res => res.json()));

            const allSuccessful = dataResults.every(data => data.success);

            if (allSuccessful) {
                // Clear cart
                await fetch("/api/cart", {
                    method: "DELETE",
                });
                alert("Order Placed Successfully!");
                window.location.href = "/"; // redirect to home
            } else {
                alert("Failed to place one or more orders. Please try again.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error placing order. Please try again.");
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-yellow-600 mb-2" />
                <p className="text-gray-500 font-medium">Loading checkout details...</p>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <Navbar />
            
            <div className="max-w-[1200px] mx-auto mt-8 px-4">
                {/* Back Link */}
                <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-yellow-600 transition-colors mb-6 group">
                    <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                    Back to Cart
                </Link>

                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Checkout</h1>
                        <p className="text-sm text-gray-500 mt-1">Please provide your details to place the order.</p>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto mt-10">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 text-amber-500">
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Items to Checkout</h2>
                        <p className="text-gray-500 mb-8 max-w-sm">
                            Your cart is empty. Add some delicious foods before trying to checkout.
                        </p>
                        <Link href="/" className="px-8 py-3.5 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-full shadow-lg shadow-yellow-600/20 transition-all duration-300 transform hover:-translate-y-0.5">
                            Explore Menu
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        
                        {/* Shipping details form */}
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Truck className="text-yellow-600" size={20} />
                                Shipping Information
                            </h2>

                            <form onSubmit={placeOrder} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="customerName"
                                            required
                                            value={formData.customerName}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Delivery Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                                        <textarea
                                            name="address"
                                            required
                                            rows={4}
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Enter your complete delivery address"
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={placingOrder}
                                    className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-yellow-600/10 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {placingOrder ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            <ClipboardCheck size={20} />
                                            Place Order (₹{finalTotal})
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary & Items Preview */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 lg:sticky lg:top-24">
                                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-50 pb-4">Items Summary</h3>
                                
                                {/* Items mini list */}
                                <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 pr-1 space-y-3">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex items-center gap-3 pt-3 first:pt-0">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
                                                <p className="text-xs text-gray-400 capitalize mt-0.5">{item.category} × {item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-gray-700 text-sm">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 border-t border-gray-50 pt-4">
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
                                        <span className="font-semibold text-gray-800">₹{taxes}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                                    <span className="text-gray-800 font-medium">Grand Total</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ₹{finalTotal}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
