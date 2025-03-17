"use client";

import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { useAuth } from "@/context/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Image from "next/image";
import StudentSidebar from "@/components/studentSidebar";

export default function Cart() {
  const { request, loading } = useApi("http://localhost:5000/api/student");
  const { isLoggedIn, token } = useAuth();
  const [cart, setCart] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  const fetchCart = async () => {
    const response = await request("GET", "/cart", null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    if (response.error) {
      toast.error(response.error);
    } else {
      setCart(response);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = new Set(prevSelected);
      newSelected.has(productId)
        ? newSelected.delete(productId)
        : newSelected.add(productId);
      return newSelected;
    });
  };

  const buySelectedItems = async () => {
    const selectedProductIds = [...selectedProducts];
    if (selectedProductIds.length === 0) {
      toast.error("Please select items to buy.");
      return;
    }

    const response = await request(
      "POST",
      "/cart/buy-selected",
      { selectedProducts: selectedProductIds },
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
      fetchCart(); // Refresh cart
    }
  };

  const totalAmount = cart?.products
    ? [...selectedProducts].reduce((sum, productId) => {
        const item = cart.products.find((p) => p.productId._id === productId);
        return item ? sum + item.quantity * item.productId.price : sum;
      }, 0)
    : 0;

  return (
    <div className="d-flex">
      <StudentSidebar />
      <div className="container mt-5">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Your Cart</h2>

        {cart && cart.products.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Select</th>
                <th>Product</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.products.map((item) => (
                <tr key={item.productId._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(item.productId._id)}
                      onChange={() =>
                        toggleProductSelection(item.productId._id)
                      }
                    />
                  </td>
                  <td>
                    <Image
                      src={
                        item.productId.images?.[0] ||
                        "/images/default_product.png"
                      }
                      alt={item.productId.name}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  </td>
                  <td>{item.productId.name}</td>
                  <td>${item.productId.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.quantity * item.productId.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">Your cart is empty.</p>
        )}

        {cart && cart.products.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: ${totalAmount.toFixed(2)}</h4>
            <Button
              variant="success"
              onClick={buySelectedItems}
              disabled={selectedProducts.size === 0}
            >
              Buy Selected Items
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
