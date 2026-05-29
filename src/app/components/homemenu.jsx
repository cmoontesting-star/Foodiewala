"use client"
import { Suspense } from "react";
import MenuItem from "./menu";

export default function HomeMenu() {
    return (
        <section className="mt-10 py-5 flex flex-col justify-center items-center ">
            <div className="text-center py-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase ">Check Out</h3>
                <h2 className="text-4xl font-bold text-red-500 uppercase italic">Our Menu</h2>
            </div>
            <div className="w-full flex justify-center mt-5">
                <Suspense fallback={<div className="text-center py-10 font-semibold text-gray-500">Loading Menu...</div>}>
                    <MenuItem />
                </Suspense>
            </div>


        </section>
    )
}


