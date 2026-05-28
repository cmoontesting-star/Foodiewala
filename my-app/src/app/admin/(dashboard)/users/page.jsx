"use client";

import { useEffect, useState } from "react";
import { Mail, Shield, User as UserIcon, Calendar } from "lucide-react";

export default function UsersAdmin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("/api/admin/users");
                const data = await res.json();
                if (res.ok && data.success) {
                    setUsers(data.users || []);
                } else {
                    setError(data.error || "Failed to fetch users");
                }
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching users.");
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <UserIcon className="w-7 h-7 text-orange-500" />
                        Manage Users
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View and manage all registered user accounts.
                    </p>
                </div>
                <span className="bg-orange-50 text-orange-600 font-semibold px-3 py-1 rounded-full text-xs border border-orange-100">
                    Total: {users.length}
                </span>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 border border-red-200">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-4 py-8">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-16 w-full bg-gray-50 animate-pulse rounded-xl border border-gray-100" />
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No users found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-sm font-semibold text-gray-500">
                                <th className="pb-4 font-semibold">User Info</th>
                                <th className="pb-4 font-semibold">Email</th>
                                <th className="pb-4 font-semibold">Role</th>
                                <th className="pb-4 font-semibold">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                    <td className="py-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                                        </div>
                                        <span className="font-semibold text-gray-900">{user.name}</span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                                            user.role === "admin" 
                                                ? "bg-red-50 text-red-600 border border-red-100" 
                                                : "bg-green-50 text-green-600 border border-green-100"
                                        }`}>
                                            <Shield className="w-3.5 h-3.5" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric"
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
