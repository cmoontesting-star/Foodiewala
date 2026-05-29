"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, UtensilsCrossed } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Categories", href: "/admin/categories", icon: UtensilsCrossed },
        { name: "Products", href: "/admin/products", icon: UtensilsCrossed },
    ];

    return (
        <div className="w-[260px] h-screen bg-black text-white p-6 flex flex-col justify-between border-r border-gray-900 shadow-xl">
            <div>
                <div className="flex items-center gap-2 mb-10 px-2">
                    <span className="w-3.5 h-3.5 bg-orange-500 rounded-full animate-pulse" />
                    <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                        FooDieeWalaa
                    </h1>
                </div>

                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-gray-900/50"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="text-xs text-gray-500 text-center border-t border-gray-900 pt-4">
                &copy; {new Date().getFullYear()} Admin Console
            </div>
        </div>
    );
}