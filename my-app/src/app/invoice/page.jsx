"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

function InvoiceContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        } else {
            setError("No order ID provided in the URL.");
            setLoading(false);
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const res = await fetch(`/api/orders?id=${id}`, { cache: "no-store" });
            const data = await res.json();
            if (data.success && data.order) {
                setOrder(data.order);
            } else {
                setError(data.message || "Failed to load order details.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching order details.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-yellow-600 mb-2" />
                <p className="text-gray-500 font-medium">Generating invoice...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                    <p className="text-red-500 font-semibold mb-4">{error || "Order not found."}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all cursor-pointer"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const subtotal = order.price * (order.quantity || 1);
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const taxes = Math.round(subtotal * 0.05);
    const finalTotal = subtotal + deliveryFee + taxes;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 print:bg-white print:pb-0">
            {/* Header / Actions Panel (hidden during print) */}
            <div className="max-w-[800px] mx-auto pt-8 px-4 flex justify-between items-center print:hidden">
                <Link
                    href="/my-orders"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-yellow-600 transition-colors group cursor-pointer"
                >
                    <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                    Back to My Orders
                </Link>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-yellow-600/10 transition-all duration-200 cursor-pointer"
                >
                    <Printer size={18} />
                    Print Invoice
                </button>
            </div>

            {/* Invoice Document Card */}
            <div className="max-w-[800px] mx-auto mt-6 bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm print:shadow-none print:border-none print:p-0 print:mt-0">
                {/* Brand / Logo & Invoice Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-100 pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent mb-1">
                            FooDieeWalaa
                        </h1>
                        <p className="text-sm text-gray-400 font-medium">Delicious Food Delivered Right to Your Doorstep</p>
                    </div>

                    <div className="text-left sm:text-right">
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice</div>
                        <h2 className="text-lg font-bold text-gray-800">
                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Date: {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                dateStyle: "long"
                            })}
                        </p>
                    </div>
                </div>

                {/* Billing / Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-gray-100 pb-8 mb-8">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Restaurant Details</h3>
                        <p className="font-semibold text-gray-800">FooDieeWalaa Kitchens</p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                            123 Gourmet Street, Food Plaza,<br />
                            Sector 45, Mumbai, MH - 400001
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Phone: +91 98765 43210</p>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Delivered To</h3>
                        <p className="font-semibold text-gray-800">{order.customerName}</p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                            {order.address}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Phone: {order.phone}</p>
                    </div>
                </div>

                {/* Items list table */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Items</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-sm font-semibold text-gray-500">
                                    <th className="pb-3">Item Description</th>
                                    <th className="pb-3 text-center">Unit Price</th>
                                    <th className="pb-3 text-center">Qty</th>
                                    <th className="pb-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                                <tr className="hover:bg-gray-50/30 transition-colors">
                                    <td className="py-4">
                                        <div className="font-semibold text-gray-800">{order.name}</div>
                                        <div className="text-xs text-gray-400 capitalize mt-0.5">{order.category}</div>
                                    </td>
                                    <td className="py-4 text-center">₹{order.price}</td>
                                    <td className="py-4 text-center font-medium">{order.quantity || 1}</td>
                                    <td className="py-4 text-right font-bold text-gray-800">₹{subtotal}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Calculations Summary */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <div className="w-full sm:w-[320px] space-y-3.5">
                        <div className="flex justify-between text-gray-500 text-sm">
                            <span>Subtotal</span>
                            <span className="font-semibold text-gray-800">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-sm">
                            <span>Delivery Fee</span>
                            {deliveryFee === 0 ? (
                                <span className="font-semibold text-green-500">Free</span>
                            ) : (
                                <span className="font-semibold text-gray-800">₹{deliveryFee}</span>
                            )}
                        </div>
                        <div className="flex justify-between text-gray-500 text-sm">
                            <span>GST & Taxes (5%)</span>
                            <span className="font-semibold text-gray-800">₹{taxes}</span>
                        </div>

                        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                            <span className="text-gray-800 font-bold">Grand Total</span>
                            <span className="text-2xl font-black text-gray-900">
                                ₹{finalTotal}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Signature/Thanks Section */}
                <div className="mt-16 text-center border-t border-gray-100 pt-8">
                    <p className="text-gray-400 text-sm italic">"Thank you for ordering from FooDieeWalaa! We hope you enjoyed your meal."</p>
                    <p className="text-xs text-gray-300 mt-4 tracking-wider uppercase font-semibold">Computer Generated Invoice</p>
                </div>
            </div>
        </div>
    );
}

export default function InvoicePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-yellow-600 mb-2" />
                <p className="text-gray-500 font-medium">Preparing page...</p>
            </div>
        }>
            <InvoiceContent />
        </Suspense>
    );
}