"use client"
import Navbar from "../../components/navbar"
import Link from "next/link"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const loginHandler = async (e) => {
        e.preventDefault();
        setError("");

        console.log("Attempting login for:", email);
        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res.error) {
                setError(res.error);
                alert("Login failed: " + res.error);
            } else {
                alert("Login successful");
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            setError(error.message);
            console.log(error.message);
            alert("Login failed: an error occurred");
        }

    }

    return (
        <section >
            <Navbar />
            <h1 className="text-center text-4xl font-bold text-primary my-4 mt-20"> Login Here</h1>
            <form onSubmit={loginHandler} className="flex flex-col gap-4 items-center w-[400px] m-auto  p-10 rounded-xl shadow-lg">
                {error && <p className="text-red-500 text-center">{error}</p>}
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="border w-full p-2 rounded-md text-lg " type="email" placeholder="email" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="border w-full p-2 rounded-md text-lg " type="password" placeholder="password" />
                <button className="border  text-white px-4 py-2 rounded-md my-4 bg-yellow-700 cursor-pointer  " type="submit">Login</button>
                <p className="text-lg text-gray-500">Don&apos;t have an account? <Link href="/register" className=" text-orange-600 font-bold hover:underline">Register</Link></p>
            </form>
            <footer className=" text-center mt-80">
                <p className="text-sm">&copy; 2026 All rights reserved. </p>
            </footer>
        </section>

    );
}