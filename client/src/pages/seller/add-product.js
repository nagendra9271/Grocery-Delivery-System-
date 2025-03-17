"use client";

import React from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import useApi from "../../hooks/useApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellerSidebar from "@/components/sellerSidebar";
import ProductForm from "@/components/ProductForm"; // ✅ Import Common Form

export default function AddProduct() {
  const { isLoggedIn, userRole, token } = useAuth();
  const router = useRouter();
  const { request, loading } = useApi("http://localhost:5000/api/seller");

  const initialData = {
    name: "",
    description: "",
    price: "",
    category: "",
    inventory: "",
    images: [],
  };

  const handleSubmit = async (data) => {
    const response = await request("POST", "/add-product", data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Product added successfully!");
      router.push("/seller/products"); // ✅ Redirect to Products Page
    }
  };

  return (
    <div className="d-flex">
      <SellerSidebar /> {/* ✅ Sidebar for navigation */}
      <div className="container mt-5 w-75">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Add New Product</h2>
        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
