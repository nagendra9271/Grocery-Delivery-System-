"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import useApi from "../../hooks/useApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentSidebar from "../../components/studentSidebar";
import Spinner from "../../components/Spinner";
import Link from "next/link";

export default function StudentDashboard() {
  const { isLoggedIn, userRole } = useAuth();
  const router = useRouter();
  const { request, loading } = useApi("http://localhost:5000/api/student");
  const [student, setStudent] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn || userRole !== "student") {
      toast.error("Unauthorized! Redirecting...");
      router.replace("/login");
      return;
    }

    const fetchStudentData = async () => {
      const token = localStorage.getItem("token");
      const response = await request("GET", "/profile", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        setStudent(response);
        setOrderCount(response.orderCount);
        setCartCount(response.cartCount);
      }
    };

    fetchStudentData();
  }, [isLoggedIn, userRole, router]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
      </div>
    );

  return (
    <div className="d-flex">
      <StudentSidebar />
      <div className="container mt-5">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Welcome, {student?.name} 👋</h2>
        <p className="text-muted">Your student dashboard overview</p>

        {/* Dashboard Cards */}
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow-sm p-3 mb-4 bg-primary text-white">
              <h5>Orders</h5>
              <p className="fs-3 fw-bold">{orderCount}</p>
              <Link href="/student/orders" className="text-white fw-bold">
                View Orders ➜
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-3 mb-4 bg-warning text-dark">
              <h5>Cart Items</h5>
              <p className="fs-3 fw-bold">{cartCount}</p>
              <Link href="/student/cart" className="text-dark fw-bold">
                View Cart ➜
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-3 mb-4 bg-success text-white">
              <h5>Track Orders</h5>
              <p className="fs-3 fw-bold">Real-Time</p>
              <Link
                href="/student/order-tracking"
                className="text-white fw-bold"
              >
                Track Now ➜
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mt-4">
          <div className="col-md-6">
            <button
              className="btn btn-outline-primary w-100 p-3 fw-bold"
              onClick={() => router.push("/student/products")}
            >
              Browse Products
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-outline-dark w-100 p-3 fw-bold"
              onClick={() => router.push("/student/delivery-slot")}
            >
              Select Delivery Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
