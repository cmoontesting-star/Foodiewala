"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {

    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()

        const res = await fetch("/api/admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        const data = await res.json()

        if (data.success) {
            localStorage.setItem("admin", "true")
            router.push("/admin/dashboard")
        } else {
            alert(data.message)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">

            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-md w-[350px]"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Admin Login
                </h1>

                <input
                    type="email"
                    placeholder="Enter Email"
                    className="w-full border p-3 rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    className="w-full border p-3 rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="w-full bg-black text-white p-3 rounded"
                >
                    Login
                </button>

            </form>

        </div>
    )
}