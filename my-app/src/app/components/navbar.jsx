"use client"
import Image from "next/image"
import Link from "next/link"
import SearchBar from "./searchbar"
import { KeyRound } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";


export default function Navbar() {

    const [cartCount, setCartCount] = useState(0);

    const handleLogout = async () => {
        await signOut();
    }

    const session = useSession();
    console.log(session);
    const status = session.status;

    const userData = session.data?.user || null;
    const name = userData?.name || userData?.email;

    const { data, error } = useSession();

    const fetchCartCount = async () => {

        try {

            const res = await fetch("/api/cart");

            const data = await res.json();

            if (data.success) {

                // TOTAL QUANTITY COUNT
                const totalCount = data.cartItems.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                );

                setCartCount(totalCount);
            }

        } catch (error) {
            console.log(error);
        }

    };
    useEffect(() => {
        fetchCartCount();
    }, []);


    return (
        <div className=" flex justify-between items-center py-4">
            <Link href="/">
                <Image className="ml-5" width={75} height={29} src="/Assests/FoodieWala.png" alt="logo" />
            </Link>

            <div className="ml-10">
                <SearchBar />
            </div>
            <div className="text-gray-600 text-xl flex  items-center gap-4 ">
                <Link className="text-gray-600 hover:underline font-bold cursor-pointer" href="/">Home</Link>
                <Link className="text-gray-600  hover:underline font-bold  cursor-pointer " href="/menu">Menu</Link>
                <Link className="text-gray-600   hover:underline font-bold  cursor-pointer " href="/about">About</Link>
                <Link className="text-gray-600  hover:underline font-bold  cursor-pointer " href="/contact">Contact</Link>
                <Link href="/cart" className="cursor-pointer ml-5" onClick={fetchCartCount}>

                    <div className="relative cursor-pointer" >

                        <ShoppingCart size={30} />

                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>

                    </div>

                </Link>


            </div>

            <div className="mr-10 flex justify-center items-center gap-2 ">
                {status === "authenticated" ? (
                    <div className="flex justify-center items-center gap-2">

                        <Link href="/profile">
                            <p className="text-gray-600 font-bold cursor-pointer hover:underline">
                                Hello {name}
                            </p>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex justify-center items-center gap-2 bg-yellow-600 hover:bg-yellow-700 transition-all duration-300 text-white font-medium px-5 py-2 rounded-full cursor-pointer"
                        >
                            <KeyRound className="text-xl w-3 h-3" />
                            Logout
                        </button>

                    </div>

                ) : (
                    <div className="flex items-center gap-3">

                        <Link href="/login">
                            <button className="text-gray-600  hover:underline font-bold cursor-pointer">
                                Login
                            </button>
                        </Link>

                        <Link href="/register">
                            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-full">
                                Register
                            </button>
                        </Link>

                    </div>


                )}
            </div>
        </div>
    );
}   