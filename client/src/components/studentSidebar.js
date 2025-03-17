"use client";

import Link from "next/link";
import { useState } from "react";

export default function StudentSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="d-flex flex-column p-3 bg-dark text-white"
      style={{
        width: isCollapsed ? "70px" : "250px",
        height: "100vh",
        transition: "width 0.3s ease-in-out",
      }}
    >
      {/* Toggle Sidebar Button */}
      <button
        className="btn btn-outline-light mb-3"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <i
          className={`bi ${
            isCollapsed ? "bi-chevron-right" : "bi-chevron-left"
          }`}
        ></i>
      </button>

      {/* Sidebar Links */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link href="/student/dashboard" className="nav-link text-white">
            <i className="bi bi-house"></i> {!isCollapsed && "Dashboard"}
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/student/products" className="nav-link text-white">
            <i className="bi bi-box"></i> {!isCollapsed && "Products"}
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/student/cart" className="nav-link text-white">
            <i className="bi bi-cart"></i> {!isCollapsed && "Cart"}
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/student/orders" className="nav-link text-white">
            <i className="bi bi-list-check"></i> {!isCollapsed && "Orders"}
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/student/order-tracking" className="nav-link text-white">
            <i className="bi bi-truck"></i> {!isCollapsed && "Order Tracking"}
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/student/delivery-slot" className="nav-link text-white">
            <i className="bi bi-clock"></i> {!isCollapsed && "Delivery Slot"}
          </Link>
        </li>
      </ul>
    </div>
  );
}
