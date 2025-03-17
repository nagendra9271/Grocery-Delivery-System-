"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import useApi from "../../hooks/useApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellerSidebar from "@/components/sellerSidebar";
import EditProductModal from "../../components/EditProductModal"; // ✅ Import Modal Component

export default function SellerProducts() {
  const {
    isLoggedIn,
    userRole,
    user,
    token,
    logout,
    loading: authLoading,
  } = useAuth();
  const router = useRouter();
  const { request, loading } = useApi("http://localhost:5000/api/seller");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isLoggedIn || userRole !== "seller")) {
      toast.error("Unauthorized! Redirecting...");
      router.replace("/login");
    }
  }, [authLoading, isLoggedIn, userRole, router]);

  useEffect(() => {
    if (!isLoggedIn || userRole !== "seller") {
      return;
    }

    const fetchProducts = async () => {
      const response = await request("GET", "/products", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        setProducts(response);
      }
    };

    fetchProducts();
  }, [isLoggedIn, userRole, router]);

  const handleToggleActive = async (productId, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1; // Toggle between 1 and 0

    if (
      !window.confirm(
        `Are you sure you want to ${
          newStatus ? "activate" : "inactivate"
        } this product?`
      )
    ) {
      return;
    }

    const response = await request(
      "PUT",
      `/toggle-active/${productId}`,
      { isActive: newStatus }, // Send 1 or 0
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success(
        `Product ${newStatus ? "activated" : "inactivated"} successfully!`
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isActive: !!newStatus }
            : product
        )
      );
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleSaveChanges = async (updatedProduct) => {
    const response = await request(
      "PUT",
      `/edit-product/${updatedProduct._id}`,
      updatedProduct,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Product updated successfully!");
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        )
      );
      setShowEditModal(false);
    }
  };

  return (
    <div className="d-flex">
      <SellerSidebar />
      <div className="container mt-5">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Your Products</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>{product.inventory}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className={`btn btn-${
                          product.isActive ? "danger" : "success"
                        } btn-sm`}
                        onClick={() =>
                          handleToggleActive(
                            product._id,
                            product.isActive ? 1 : 0
                          )
                        }
                      >
                        {product.isActive ? "Inactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Edit Product Modal */}
      <EditProductModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={selectedProduct}
        onSave={handleSaveChanges}
        loading={loading}
      />
    </div>
  );
}
