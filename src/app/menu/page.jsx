"use client";

import { Suspense } from "react";
import MenuItem from "../components/menu";

export default function MenuPage() {
    return (
        <div className="min-h-screen bg-gray-50">

            <div className="p-40 pt-10">
                <p className="text-orange-500 text-5xl  font-extrabold text-center italic">MENU</p>
                <h1 className="text-5xl font-bold text-center">Our Delicious Food Menu </h1>
                <h1 className="text-5xl font-bold text-center">Only <span className="text-orange-500">Biryanies</span> will Avialble Here </h1>
            </div>
            <Suspense fallback={<div className="text-center py-10 font-semibold text-gray-500">Loading Menu...</div>}>
                <MenuItem />
            </Suspense>

        </div>
    )
}