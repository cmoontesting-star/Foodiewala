"use client";

import Navbar from "../components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { User as UserIcon } from "lucide-react";

export default function Profile() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const [username, setUsername] = useState("");
    const [useremail, setUseremail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [userRole, setUserRole] = useState("user");
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [myorder, setMyorder] = useState([]);


    const handleMyOrder = () => {
        router.push("/my-orders");
    }

    // Initial sync from session state
    useEffect(() => {
        if (session?.user) {
            setUsername(session.user.name || "");
            setUseremail(session.user.email || "");
            setAvatar(session.user.image || "");
            setUserRole(session.user.role || "user");
            setMyorder(session.user.myorder || []);
        }
    }, [session]);

    // Live profile retrieval from database GET route on mount
    useEffect(() => {
        let isMounted = true;
        async function fetchLiveProfile() {
            try {
                const response = await fetch("/api/profile");
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.user && isMounted) {
                        setUsername(data.user.name || "");
                        setUseremail(data.user.email || "");
                        setAvatar(data.user.image || "");
                        setUserRole(data.user.role || "user");
                        setMyorder(data.user.myorder || []);
                    }
                }
            } catch (err) {
                console.error("Failed to load live database profile:", err);
            }
        }

        if (status === "authenticated") {
            fetchLiveProfile();
        }
    }, [status]);

    // Redirect to login if unauthenticated (client-side safe)
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p className="text-xl font-medium animate-pulse text-orange-500">Loading...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    const handleEdit = (e) => {
        e.preventDefault();
        setIsEditing(true);
        setError(null);
        setSuccessMessage("");

    };

    const handleCancel = (e) => {
        e.preventDefault();
        setUsername(session?.user?.name || "");
        setUseremail(session?.user?.email || "");
        setAvatar(session?.user?.image || "");
        setIsEditing(false);
        setError(null);
        setSuccessMessage("");

    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError("Image must be smaller than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    async function handleProfileUpdate(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage("");
        setMyorder(session?.user?.myorder || []);

        if (!username.trim()) {
            setError("Name cannot be empty");
            setSaving(false);
            return;
        }
        if (!useremail.trim()) {
            setError("Email cannot be empty");
            setSaving(false);
            return;
        }

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: username,
                    email: useremail,
                    image: avatar
                }),
            });

            const res = await response.json();

            if (response.ok && res.success) {
                // Update client session state
                await update({
                    name: username,
                    email: useremail,
                    image: avatar
                });
                setSuccessMessage("Profile updated successfully!");
                setIsEditing(false);
            } else {
                setError(res.error || "Failed to update profile");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="bg-white text-black min-h-screen">
            <Navbar />

            <div className="max-w-md mx-auto mt-10 p-6 shadow-xl rounded-2xl border border-gray-100 bg-white">
                <h1 className="text-3xl font-extrabold text-orange-500 text-center mb-6">User Profile</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 text-center border border-red-200">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm mb-4 text-center border border-green-200">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <div className="relative group w-28 h-28 bg-orange-100 rounded-full flex items-center justify-center shadow-inner border-2 border-orange-200 overflow-hidden">
                            {avatar ? (
                                <Img src={avatar} alt="avatar" width={112} height={112} className="object-cover w-full h-full" />
                            ) : (
                                <UserIcon className="w-16 h-16 text-orange-500" />
                            )}

                            {isEditing && (
                                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-[11px] font-semibold opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 text-center">
                                    <span className="mb-0.5">Upload</span>
                                    <span>Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        disabled={saving}
                                    />
                                </label>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Role: <span className="font-semibold text-orange-600 uppercase">{userRole}</span></p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="Name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={!isEditing || saving}
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={useremail}
                                onChange={(e) => setUseremail(e.target.value)}
                                disabled={!isEditing || saving}
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        {isEditing ? (
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-colors duration-300 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-colors duration-300 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-colors duration-300"
                            >
                                Edit Profile
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleMyOrder}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-colors duration-300"
                            href="/my-orders"
                        >
                            My Orders
                        </button>
                    </div>
                </form>
            </div>

            <footer className="text-center border-t py-6 mt-20 text-gray-500">
                <p className="text-sm">&copy; 2026 FooDieeWalaa. All rights reserved.</p>
            </footer>
        </section>
    );
}