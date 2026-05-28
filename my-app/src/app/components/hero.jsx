"use client"
import Image from "next/image";
import { MoveRight } from "lucide-react";
import Link from "next/link";


export default function Hero() {
    return (
        <section  >
            <div className="grid grid-cols-2 gap-10  items-center">
                <div className="pl-4 ">
                    <h1 className="text-6xl font-bold">It&apos;s Time for a Delicious Break</h1>
                    <p className="text-base text-gray-600 mt-5  font-medium">Savor every bite of our chef-prepared dishes, made with the freshest ingredients and packed with flavor.</p>
                    <div className="flex items-center justify-center gap-5 mr-10 ">
                        <Link href="/menu">
                            <button className="bg-yellow-600 hover:bg-yellow-700 transition-all duration-300 text-white font-medium px-5 py-2 rounded-full  mt-5 ">Order Now</button>
                        </Link>
                        <Link href="/about" >
                            <button className="bg-yellow-600 hover:bg-yellow-700 transition-all duration-300 text-white font-medium px-5 py-2 rounded-full  mt-5  flex items-center justify-center gap-2 ">Learn More <MoveRight /></button>
                        </Link>
                    </div>
                </div>
                <Image className="transition-all duration-500 hover:scale-105 " src="/Assests/biryani.png" alt="hero" width={700} height={600} />
            </div>




        </section>
    )
}