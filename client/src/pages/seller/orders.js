"use client";

import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { useAuth } from "@/context/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "next/image";
import SellerSidebar from "@/components/sellerSidebar";

export default function SellerOrders() {
  const { request } = useApi("http://localhost:5000/api/seller/orders");
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
      // ✅ Sort orders based on status priority (Pending → Processing → Shipped → Delivered)
      const statusPriority = {
        Pending: 1,
        Processing: 2,
        Shipped: 3,
        Delivered: 4,
      };
      const sortedOrders = response.sort(
        (a, b) => statusPriority[a.status] - statusPriority[b.status]
      );
      setOrders(sortedOrders);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const response = await request(
      "PUT",
      `/${orderId}/status`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Order status updated!");
      fetchOrders();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="d-flex">
      <SellerSidebar />
      <div className="container mt-5">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Orders</h2>

        {orders.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Student</th>
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
                          order.productId.images?.[0] ||
                          "/images/default_product.png"
                        }
                        alt={order.productId.name}
                        width={50}
                        height={50}
                        className="rounded me-2"
                      />
                      <span>{order.productId.name}</span>
                    </div>
                  </td>
                  <td>{order.quantity}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{order.studentId?.name || "N/A"}</td>
                  <td>{order.status}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    {order.status !== "Delivered" &&
                      order.status !== "Cancelled" && (
                        <Dropdown>
                          <Dropdown.Toggle variant="primary" size="sm">
                            Update Status
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {order.status === "Pending" && (
                              <>
                                <Dropdown.Item
                                  onClick={() =>
                                    updateOrderStatus(order._id, "Processing")
                                  }
                                >
                                  Processing
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    updateOrderStatus(order._id, "Shipped")
                                  }
                                >
                                  Shipped
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    updateOrderStatus(order._id, "Delivered")
                                  }
                                >
                                  Delivered
                                </Dropdown.Item>
                              </>
                            )}
                            {order.status === "Processing" && (
                              <>
                                <Dropdown.Item
                                  onClick={() =>
                                    updateOrderStatus(order._id, "Shipped")
                                  }
                                >
                                  Shipped
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    updateOrderStatus(order._id, "Delivered")
                                  }
                                >
                                  Delivered
                                </Dropdown.Item>
                              </>
                            )}
                            {order.status === "Shipped" && (
                              <>
                                <Dropdown.Item
                                  onClick={() =>
                                    updateOrderStatus(order._id, "Delivered")
                                  }
                                >
                                  Delivered
                                </Dropdown.Item>
                              </>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
