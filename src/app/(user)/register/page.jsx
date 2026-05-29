"use client"
import Navbar from "../../components/navbar"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { registerAction } from "../../serverActions/registerAction"

function RegisterContent() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null);
    const [userCreating, setUserCreating] = useState(false);
    const router = useRouter()
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleRegister = async (e) => {
        e.preventDefault()
        setUserCreating(true)
        setError(null)
        const userregister = {
            name,
            email,
            password,
        }
        console.log(userregister)
        try {
            const resData = await registerAction(userregister);
            console.log("Register response:", resData);
            if (resData.success) {
                toast.success("User registered successfully");
                setName("");
                setEmail("");
                setPassword("");
                router.push(`/login${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`);
            }
            else {
                setError(resData.error || "Registration failed");
                toast.error("Registration failed: " + (resData.error || "Unknown error"));
            }
        } catch (error) {
            console.log(error);
            setError(error.message || "An error occurred during registration");
            toast.error("An error occurred during registration");
        } finally {
            setUserCreating(false)
        }
    }

    return (
        <form onSubmit={handleRegister} className="flex flex-col gap-4 items-center w-[400px] m-auto  p-10 rounded-xl shadow-lg">
            {error && (
                <p className="text-red-500 text-center">
                    {error}
                </p>
            )}

            <input disabled={userCreating} value={name} onChange={(e) => setName(e.target.value)} className="border w-full p-2 rounded-md text-lg " type="text" placeholder="name" required />

            <input disabled={userCreating} value={email} onChange={(e) => setEmail(e.target.value)} className="border w-full p-2 rounded-md text-lg " type="email" placeholder="email" required />
            <input disabled={userCreating} value={password} onChange={(e) => setPassword(e.target.value)} className="border w-full p-2 rounded-md text-lg " type="password" placeholder="password" required />
            <button disabled={userCreating} className="border  text-white px-4 py-2 rounded-md my-4 bg-yellow-600 hover:bg-yellow-700 transition-all duration-300" type="submit">register</button>
            <p className="text-lg text-gray-500">Already have an account? <Link href={`/login${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className=" text-orange-600 font-bold hover:underline">Login</Link></p>
        </form>
    );
}

export default function Register() {
    return (
        <section >
            <Navbar />
            <h1 className="text-center text-4xl font-bold text-primary my-4 mt-20"> register Here</h1>
            <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
                <RegisterContent />
            </Suspense>
            <footer className=" text-center mt-80">
                <p className="text-sm">&copy; 2026 All rights reserved. </p>
            </footer>
        </section>
    );
}