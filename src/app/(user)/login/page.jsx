"use client"
import Navbar from "../../components/navbar"
import Link from "next/link"
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

function LoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const loginHandler = async (e) => {
        e.preventDefault();
        setError("");
        console.log("Attempting login for:", email);
        try {
            const data = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (data?.error) {
                setError(data.error);
                toast.error("Login failed: " + data.error);
            } else {
                toast.success("Login successful");
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error) {
            setError(error.message);
            console.log(error.message);
            toast.error("Login failed: an error occurred");
        }
    };

    return (
        <form onSubmit={loginHandler} className="flex flex-col gap-4 items-center w-[400px] m-auto  p-10 rounded-xl shadow-lg">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="border w-full p-2 rounded-md text-lg " type="email" placeholder="email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="border w-full p-2 rounded-md text-lg " type="password" placeholder="password" />
            <button className="border  text-white px-4 py-2 rounded-md my-4 bg-yellow-700 cursor-pointer  " type="submit">Login</button>
            <p className="text-lg text-gray-500">Don&apos;t have an account? <Link href={`/register${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className=" text-orange-600 font-bold hover:underline">Register</Link></p>
        </form>
    );
}

export default function Register() {
    return (
        <section >
            <Navbar />
            <h1 className="text-center text-4xl font-bold text-primary my-4 mt-20"> Login Here</h1>
            <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
                <LoginContent />
            </Suspense>
            <footer className=" text-center mt-80">
                <p className="text-sm">&copy; 2026 All rights reserved. </p>
            </footer>
        </section>
    );
}