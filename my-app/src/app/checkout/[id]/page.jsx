"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    const [product, setProduct] = useState(null);

    // NEW

    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        address: "",
    });

    // Enforce login restriction and pre-fill name
    useEffect(() => {
        if (status === "unauthenticated") {
            toast.error("Please login or register to checkout.");
            router.push("/login?callbackUrl=" + window.location.pathname);
        } else if (status === "authenticated" && session?.user) {
            setFormData(prev => ({
                ...prev,
                customerName: prev.customerName || session.user.name || session.user.email || ""
            }));
        }
    }, [status, session, router]);

    // FETCH PRODUCT
    useEffect(() => {

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.product);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product details.");
            }
        };
        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    // HANDLE INPUTS
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePlaceOrder = async () => {
        // LOGIN CHECK
        if (status !== "authenticated") {
            toast.error("Please Login/Register First");
            router.push("/login?callbackUrl=" + window.location.pathname);
            return;
        }

        // VALIDATION
        if (!formData.customerName || !formData.phone || !formData.address) {
            toast.error("Please Fill All Fields");
            return;
        }

        try {
            // CREATE RAZORPAY ORDER
            const res = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: product.price,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "Failed to create payment order.");
                return;
            }

            // OPEN RAZORPAY
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "FoodieWala",
                description: "Food Order Payment",
                order_id: data.order.id,
                handler: async function (response) {
                    toast.success("Payment Successful");

                    // SAVE ORDER
                    const orderRes = await fetch("/api/orders", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            productId: product._id,
                            name: product.name,
                            image: product.image,
                            category: product.category,
                            price: product.price,
                            quantity: 1,
                            customerName: formData.customerName,
                            phone: formData.phone,
                            address: formData.address,
                            paymentMethod: "Razorpay",
                            paymentStatus: "Paid",
                            orderStatus: "Confirmed",
                        }),
                    });

                    const orderData = await orderRes.json();
                    if (orderData.success) {
                        toast.success("Order Placed Successfully!");
                        router.push("/my-orders");
                    } else {
                        toast.error(orderData.message || "Failed to save order.");
                    }
                },
                prefill: {
                    name: formData.customerName,
                    contact: formData.phone,
                    email: session?.user?.email,
                },
                theme: {
                    color: "#f97316",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.log(error);
            toast.error("Payment Failed");
        }
    };

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h1 className="text-2xl font-bold">Loading...</h1>
            </div>
        );

    }
    return (
        <div className="max-w-5xl mx-auto p-5">
            <h1 className="text-3xl font-bold mb-5">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-10">
                {/* PRODUCT */}
                <div className="border p-5 rounded">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded"
                    />

                    <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
                    <p>{product.category}</p>
                    <p className="text-orange-500 text-2xl font-bold mt-3">₹ {product.price}</p>
                </div>

                {/* FORM */}
                <div className="border p-5 rounded">
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        placeholder="Enter Name"
                        className="border p-3 w-full rounded mb-4"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        placeholder="Enter Phone Number"
                        className="border p-3 w-full rounded mb-4"
                        onChange={handleChange}
                    />

                    <textarea
                        name="address"
                        value={formData.address}
                        placeholder="Enter Address"
                        className="border p-3 w-full rounded mb-4"
                        onChange={handleChange}
                    />

                    <button
                        onClick={handlePlaceOrder}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded w-full transition-all cursor-pointer font-bold"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}