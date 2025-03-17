"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext"; // Adjust the import path
import { useRouter } from "next/navigation";
import useApi from "../../hooks/useApi"; // Adjust the import path
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellerSidebar from "../../components/sellerSidebar"; // Adjust the import path
import Spinner from "../../components/Spinner"; // Adjust the import path

export default function SellerDashboard() {
  const {
    isLoggedIn,
    userRole,
    user,
    logout,
    loading: authLoading,
  } = useAuth();
  const router = useRouter();
  const {
    request,
    loading: apiLoading,
    error,
  } = useApi("http://localhost:5000/api/seller");
  const [seller, setSeller] = useState(null);

  // Redirect if not logged in or not a seller
  useEffect(() => {
    if (!authLoading && (!isLoggedIn || userRole !== "seller")) {
      toast.error("Unauthorized! Redirecting...");
      router.replace("/login");
    }
  }, [authLoading, isLoggedIn, userRole, router]);

  // Fetch seller details after authentication is confirmed
  useEffect(() => {
    if (!isLoggedIn || userRole !== "seller") return;

    const fetchSeller = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found.");
        router.replace("/login");
        return;
      }

      const response = await request("GET", "/dashboard", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        setSeller(response);
      }
    };

    fetchSeller();
  }, [isLoggedIn, userRole, router]);

  // Show spinner while auth or API is loading
  if (authLoading || apiLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
      </div>
    );
  }

  // Redirect if not logged in or not a seller
  if (!isLoggedIn || userRole !== "seller") {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="d-flex">
      <SellerSidebar />
      <div className="container mt-5">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="d-flex justify-content-between align-items-center">
          <h2>Hi, {seller?.name || user?.name} 👋</h2>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
        <p className="text-muted">Welcome to your seller dashboard.</p>

        {/* Display Seller Details */}
        <div className="card p-4 mt-4">
          <h4>Seller Details</h4>
          <ul className="list-unstyled">
            <li>
              <strong>Store Name:</strong> {seller?.store_name}
            </li>
            <li>
              <strong>Email:</strong> {seller?.email || user?.email}
            </li>
            <li>
              <strong>Contact Number:</strong> {seller?.contactNumber}
            </li>
            {/* <li>
              <strong>Address:</strong> {seller?.address}
            </li> */}
            {/* <li>
              <strong>Operating Hours:</strong> {seller?.operatingHours}
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}
