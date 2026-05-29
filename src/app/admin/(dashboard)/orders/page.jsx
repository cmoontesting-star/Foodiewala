"use client";

import { ShoppingBag, CheckCircle, Clock, Truck, XCircle, Search, } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";



export default function OrdersAdmin() {
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {

        try {

            const res = await fetch(`/api/orders`, { cache: "no-store" });

            const data = await res.json();

            if (data.success) {
                setOrders(data.orders);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const filteredOrders = orders.filter(order => {
        const idStr = order._id ? order._id.toString().toLowerCase() : "";
        const customerStr = order.customerName ? order.customerName.toLowerCase() : "";
        const nameStr = order.name ? order.name.toLowerCase() : "";
        const term = searchTerm.toLowerCase();
        return idStr.includes(term) || customerStr.includes(term) || nameStr.includes(term);
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-50 text-green-600 border-green-150";
            case "Delivering":
                return "bg-blue-50 text-blue-600 border-blue-150";
            case "Pending":
                return "bg-yellow-50 text-yellow-600 border-yellow-150";
            case "Cancelled":
                return "bg-red-50 text-red-600 border-red-150";
            default:
                return "bg-gray-50 text-gray-600 border-gray-150";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered":
                return <CheckCircle className="w-3.5 h-3.5" />;
            case "Delivering":
                return <Truck className="w-3.5 h-3.5" />;
            case "Pending":
                return <Clock className="w-3.5 h-3.5" />;
            case "Cancelled":
                return <XCircle className="w-3.5 h-3.5" />;
            default:
                return null;
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingBag className="w-7 h-7 text-orange-500" />
                        Manage Orders
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Track and update restaurant order logs.
                    </p>
                </div>

                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                        type="text"
                        placeholder="Search order ID or customer..."
                        className="pl-9 pr-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 w-full md:w-64 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-sm font-semibold text-gray-500">
                            <th className="pb-4 font-semibold">Order ID</th>
                            <th className="pb-4 font-semibold">Customer</th>
                            <th className="pb-4 font-semibold">Items Ordered</th>
                            <th className="pb-4 font-semibold">Total Price</th>
                            <th className="pb-4 font-semibold">Address</th>
                            <th className="pb-4 font-semibold">Time Log</th>
                            <th className="pb-4 font-semibold">invoice</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400">
                                    No matching orders found.
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                    <td className="py-4 font-semibold text-orange-600">
                                        #{order._id ? order._id.substring(order._id.length - 8).toUpperCase() : ""}
                                    </td>
                                    <td className="py-4 font-medium text-gray-900">{order.customerName || "N/A"}</td>
                                    <td className="py-4 text-gray-600 truncate max-w-[200px]">
                                        {order.quantity}x {order.name}
                                    </td>
                                    <td className="py-4 font-bold text-gray-900">
                                        ₹{order.price * (order.quantity || 1)}
                                    </td>
                                    <td className="py-4 text-gray-600 truncate max-w-[250px]" title={order.address}>
                                        {order.address || "N/A"}
                                    </td>
                                    <td className="py-4 text-gray-500">
                                        {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", {
                                            dateStyle: "short",
                                            timeStyle: "short"
                                        }) : "N/A"}
                                    </td>

                                    <td className="py-4">
                                        <Link href={`/admin/invoice?id=${order._id}`} className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-orange-100 transition-colors">
                                            Print Invoice
                                        </Link>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
