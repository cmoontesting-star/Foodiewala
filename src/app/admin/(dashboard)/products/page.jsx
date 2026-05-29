




"use client"

import { useEffect, useState } from "react"

export default function ProductsPage() {

    const [products, setProducts] = useState([])


    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        image: null,
        description: "",
        category: "",
    })

    /* FETCH PRODUCTS */
    const fetchProducts = async () => {

        const res = await fetch("/api/products")

        const data = await res.json()

        setProducts(data.products || [])
    }

    const [categories, setCategories] = useState([])

    async function fetchCategories() {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data.categories || [])
    }

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    /* HANDLE INPUT */
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    /* ADD PRODUCT */
    const handleSubmit = async (e) => {

        e.preventDefault()

        setLoading(true)

        try {
            const data = new FormData()
            data.append("name", formData.name)
            data.append("price", formData.price)
            data.append("description", formData.description)
            data.append("category", formData.category)
            if (formData.image) {
                data.append("image", formData.image)
            }

            const res = await fetch("/api/products", {
                method: "POST",
                body: data,
            })

            const resData = await res.json()

            if (resData.success) {
                fetchProducts()
                setFormData({
                    name: "",
                    price: "",
                    image: null,
                    description: "",
                    category: "",
                })
                e.target.reset()
            } else {
                alert(resData.error || "Failed to add product")
            }
        } catch (error) {
            console.error("Error adding product:", error)
            alert("Failed to add product")
        }

        setLoading(false)
    }

    /* DELETE PRODUCT */
    const deleteProduct = async (id) => {

        await fetch(`/api/products?id=${id}`, {
            method: "DELETE",
        })

        fetchProducts()
    }

    return (

        <div>

            <div className="flex items-center justify-between mb-8">

                <h1 className="text-4xl font-bold">
                    Product Management
                </h1>

            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow mb-10"
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border p-3 rounded-lg w-full"
                        required
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        className="border p-3 rounded-lg w-full"
                        required
                    />

                    <select
                        className="border p-2 w-full rounded"
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                category: e.target.value,
                            })
                        }
                    >
                        <option value="">Select Category</option>

                        {categories.map((item) => (
                            <option key={item._id} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="file"
                        name="image"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        className="border p-3 rounded-lg w-full"
                        required
                    />

                </div>


                <div className="mt-4">
                    <textarea
                        name="description"
                        placeholder="Product Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border p-3 rounded-lg w-full h-24 resize-none"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 bg-black text-white px-6 py-3 rounded-lg"
                >
                    {
                        loading
                            ? "Adding..."
                            : "Add Product"
                    }
                </button>

            </form>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-black text-white">

                        <tr>

                            <th className="p-4 text-left">
                                Product
                            </th>

                            <th className="p-4 text-left">
                                Price
                            </th>

                            <th className="p-4 text-left">
                                Category
                            </th>

                            <th className="p-4 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            products.map((item) => (

                                <tr
                                    key={item._id}
                                    className="border-b"
                                >

                                    <td className="p-4">
                                        {item.name}
                                    </td>

                                    <td className="p-4">
                                        ₹{item.price}
                                    </td>

                                    <td className="p-4">
                                        {item.category}
                                    </td>

                                    <td className="p-4">

                                        <button
                                            onClick={() =>
                                                deleteProduct(item._id)
                                            }
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    )
}