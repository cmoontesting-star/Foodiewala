"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [stats, setStats] = useState({
        usersCount: 0,
        ordersCount: 0,
        revenue: 580,
    });
    const [loading, setLoading] = useState(true);

    const [orderCount, setOrderCount] = useState(0);
    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.users)) {
                    setStats(prev => ({
                        ...prev,
                        usersCount: data.users.length
                    }));
                }
            }
        } catch (err) {
            console.error("Failed to fetch dashboard user statistics:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders", { cache: "no-store" });
                const data = await res.json();

                if (data.success) {
                    setOrderCount(data.orders.length);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
                Admin Dashboard Overview
            </h1>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Users Metric Card */}
                <Link href="/admin/users">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 transition-transform duration-300 hover:-translate-y-1">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Total Registered Users
                        </h2>
                        <p className="text-4xl font-extrabold text-orange-500 mt-4">
                            {loading ? "..." : stats.usersCount}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Live from MongoDB</p>
                    </div>
                </Link>

                {/* Orders Metric Card */}
                <Link href="/admin/orders">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 transition-transform duration-300 hover:-translate-y-1">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Total Orders
                        </h2>
                        <p className="text-4xl font-extrabold text-gray-800 mt-4">
                            {orderCount}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Simulated Order Logs</p>
                    </div>
                </Link>

                {/* Revenue Metric Card */}
                <Link href="/admin/orders">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 transition-transform duration-300 hover:-translate-y-1">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Revenue Generated
                        </h2>
                        <p className="text-4xl font-extrabold text-green-600 mt-4">
                            ₹{stats.revenue}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Processed Sales</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
