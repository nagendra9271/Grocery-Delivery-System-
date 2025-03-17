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

export default function Orders() {
  const { request } = useApi("http://localhost:5000/api/orders");
  const { isLoggedIn, token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    const response = await request("GET", "/", null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.error) {
      toast.error(response.error);
    } else {
      setOrders(response);
    }
  };

  const cancelOrder = async (orderId) => {
    const response = await request("PUT", `/${orderId}/cancel`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Order cancelled successfully!");
      fetchOrders();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="d-flex">
      <StudentSidebar />
      <div className="container mt-5">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Your Orders</h2>

        {orders.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Booked On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <Image
                        src={
                          order?.productId?.images?.[0] ||
                          "/images/default_product.png"
                        }
                        alt={order?.productId?.name || "Unknown Product"}
                        width={50}
                        height={50}
                        className="rounded me-2"
                      />
                      <span>{order?.productId?.name || "Unknown Product"}</span>
                    </div>
                  </td>
                  <td>{order.quantity}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>{formatDate(order.createdAt)}</td>{" "}
                  {/* ✅ Booked On Date */}
                  <td>
                    {order.status === "Pending" ||
                    order.status === "Processing" ? (
                      <Button
                        variant="danger"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">No orders placed yet.</p>
        )}
      </div>
    </div>
  );
}
