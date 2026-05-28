"use client";

import Sidebar from "@/app/components/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setMounted(true);
        const isAdmin = localStorage.getItem("admin");
        if (isAdmin === "true") {
            setIsAuthenticated(true);
        } else {
            router.push("/admin");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("admin");
        router.push("/admin");
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="flex min-h-screen bg-gray-100 items-center justify-center">
                <div className="text-xl font-medium animate-pulse text-orange-500">Loading Layout...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 text-black">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <div className="w-full bg-white shadow-md p-4 flex items-center justify-between border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Admin Panel
                    </h1>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleLogout}
                            className="bg-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-6 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
