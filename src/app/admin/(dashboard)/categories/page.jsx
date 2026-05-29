"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Tag, AlertCircle } from "lucide-react";

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/categories");
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories || []);
            } else {
                setError(data.message || "Failed to load categories.");
            }
        } catch (err) {
            setError("Error connecting to server.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        
        if (!name.trim()) {
            setError("Category name cannot be empty.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name.trim() }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccessMsg(`Category "${name}" added successfully!`);
                setName("");
                // Refresh list
                await fetchCategories();
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMsg(""), 3000);
            } else {
                setError(data.message || "Failed to add category.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete category
    const handleDelete = async (id, catName) => {
        if (!confirm(`Are you sure you want to delete the category "${catName}"?`)) {
            return;
        }

        setError("");
        setSuccessMsg("");
        try {
            setDeletingId(id);
            const res = await fetch(`/api/categories?id=${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                setSuccessMsg(`Category "${catName}" deleted successfully.`);
                // Refresh list
                await fetchCategories();
                setTimeout(() => setSuccessMsg(""), 3000);
            } else {
                setError(data.message || "Failed to delete category.");
            }
        } catch (err) {
            setError("Failed to connect to server for deletion.");
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Category Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Create, organize, and manage your food menu categories.
                    </p>
                </div>
            </div>

            {/* Notification Messages */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 animate-fadeIn">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}
            {successMsg && (
                <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 animate-fadeIn">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    <span className="text-sm font-medium">{successMsg}</span>
                </div>
            )}

            {/* Content grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Create Form Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-fit">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-orange-500" />
                            Create Category
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="category-name" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Category Name
                                </label>
                                <input
                                    id="category-name"
                                    type="text"
                                    placeholder="e.g. Desserts, Pizza, Drinks"
                                    className="w-full border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl p-3 text-sm transition-all outline-none"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !name.trim()}
                                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:scale-100 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm shadow-orange-500/10"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Add Category
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Categories List Card */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-gray-400" />
                            Existing Categories
                        </h2>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
                            {categories.length} {categories.length === 1 ? "category" : "categories"}
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                            <p className="text-sm text-gray-500 mt-2 font-medium">Loading categories...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                            <Tag className="w-12 h-12 text-gray-300 stroke-[1.5] mb-3" />
                            <h3 className="text-base font-bold text-gray-700">No categories found</h3>
                            <p className="text-sm text-gray-400 max-w-xs mt-1">
                                Create your first category using the form on the left to start organizing your menu items.
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto max-h-[500px] pr-1 space-y-2">
                            {categories.map((cat) => (
                                <div
                                    key={cat._id}
                                    className="flex items-center justify-between p-3.5 hover:bg-gray-50/80 border border-gray-100 rounded-xl transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                            <Tag className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
                                            {cat.createdAt && (
                                                <p className="text-[10px] text-gray-400 font-medium">
                                                    Created {new Date(cat.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(cat._id, cat.name)}
                                        disabled={deletingId === cat._id}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none"
                                        title="Delete category"
                                    >
                                        {deletingId === cat._id ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}