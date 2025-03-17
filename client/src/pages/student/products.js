"use client";

import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { useAuth } from "@/context/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentSidebar from "@/components/studentSidebar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

export default function StudentProducts() {
  const { request, loading } = useApi("http://localhost:5000/api/student");
  const { isLoggedIn, user, token } = useAuth(); // ✅ Get auth details
  const [products, setProducts] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await request("GET", "/products");

      if (response.error) {
        toast.error(response.error);
        setProducts([]); // ✅ Ensure products is always an array
      } else if (Array.isArray(response)) {
        setProducts(response); // ✅ If API returns an array directly
      } else if (Array.isArray(response.products)) {
        setProducts(response.products); // ✅ If API returns { products: [...] }
      } else {
        toast.error("Unexpected response format.");
        setProducts([]); // ✅ Prevent map() from breaking
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedQuantities(
      products.reduce((acc, product) => {
        acc[product._id] = 1; // Default quantity is 1
        return acc;
      }, {})
    );
  }, [products]);

  const handleQuantityChange = (productId, value) => {
    setSelectedQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const addToCart = async (productId) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to add items to the cart.");
      return;
    }

    const quantity = selectedQuantities[productId];
    const response = await request(
      "POST",
      "/cart/add",
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Product added to cart!");
    }
  };

  const buyNow = async (productId) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to buy items.");
      return;
    }
    const quantity = selectedQuantities[productId];
    const response = await request(
      "POST",
      "/buy-now",
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Order placed successfully!");
    }
  };

  return (
    <div className="d-flex">
      <StudentSidebar />
      <div className="container mt-5">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Available Products</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 mb-3">
                <div className="card shadow-sm product-card">
                  <Image
                    src={product.images?.[0] || "/images/default_product.png"}
                    alt={product.name}
                    className="product-image"
                    width={200}
                    height={150}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="product-description">{product.description}</p>
                    <p className="card-text fw-bold">${product.price}</p>
                    <select
                      className="form-select mb-2"
                      value={selectedQuantities[product._id]}
                      onChange={(e) =>
                        handleQuantityChange(
                          product._id,
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {[1, 2, 3, 4, 5].map((qty) => (
                        <option
                          key={qty}
                          value={qty}
                          disabled={qty > product.inventory}
                        >
                          {qty}
                        </option>
                      ))}
                    </select>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(product._id)}
                        disabled={product.inventory === 0}
                      >
                        {product.inventory === 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => buyNow(product._id)}
                        disabled={product.inventory === 0}
                      >
                        {product.inventory === 0 ? "Sold Out" : "Buy Now"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .product-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .product-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .product-description {
          max-height: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
