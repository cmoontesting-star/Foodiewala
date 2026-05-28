"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CheckoutPage() {

    const params = useParams();

    const [product, setProduct] = useState(null);

    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        address: "",
    });

    // FETCH PRODUCT
    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {

        const res = await fetch(`/api/products/${params.id}`);

        const data = await res.json();

        if (data.success) {
            setProduct(data.product);
        }
    };

    // HANDLE INPUTS
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // PLACE ORDER
    const placeOrder = async () => {

        const res = await fetch("/api/orders", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                productId: product._id,
                name: product.name,
                category: product.category,
                image: product.image,
                price: product.price,
                quantity: 1,

                customerName: formData.customerName,
                phone: formData.phone,
                address: formData.address,
            }),
        });

        const data = await res.json();

        if (data.success) {
            alert("Order Placed Successfully");
        }
    };

    if (!product) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="max-w-5xl mx-auto p-5">

            <h1 className="text-3xl font-bold mb-5">
                Checkout
            </h1>

            <div className="grid md:grid-cols-2 gap-10">

                {/* PRODUCT */}
                <div className="border p-5 rounded">

                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded"
                    />

                    <h2 className="text-2xl font-bold mt-4">
                        {product.name}
                    </h2>

                    <p>{product.category}</p>

                    <p className="text-orange-500 text-2xl font-bold mt-3">
                        ₹ {product.price}
                    </p>

                </div>

                {/* FORM */}
                <div className="border p-5 rounded">

                    <input
                        type="text"
                        name="customerName"
                        placeholder="Enter Name"
                        className="border p-3 w-full rounded mb-4"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter Phone Number"
                        className="border p-3 w-full rounded mb-4"
                        onChange={handleChange}
                    />

                    <textarea
                        name="address"
                        placeholder="Enter Address"
                        className="border p-3 w-full rounded mb-4"
                        onChange={handleChange}
                    />

                    <button
                        onClick={placeOrder}
                        className="bg-green-500 text-white px-6 py-3 rounded w-full"
                    >
                        Place Order
                    </button>

                </div>

            </div>

        </div>
    );
}