"use client";

import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { useAuth } from "@/context/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellerSidebar from "@/components/sellerSidebar";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

export default function CompletedOrders() {
  const { request, loading } = useApi("http://localhost:5000/api/seller");
  const { isLoggedIn, token } = useAuth(); // ✅ Get auth details
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCompletedOrders();
    }
  }, [isLoggedIn]);

  const fetchCompletedOrders = async () => {
    const response = await request("GET", "/orders/completed", null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.error) {
      toast.error(response.error);
    } else {
      setOrders(response);
    }
  };

  return (
    <div className="d-flex">
      <SellerSidebar />
      <div className="container mt-5">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Completed Orders</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No completed orders yet.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Completed On</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.productId?.name || "N/A"}</td>
                  <td>{order.quantity}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{new Date(order.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
