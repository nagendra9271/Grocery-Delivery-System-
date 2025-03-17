"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation"; // Import router

export default function SellerSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  // Sidebar links data
  const menuItems = [
    { href: "/seller/dashboard", icon: "bi-house-door", label: "Dashboard" },
    { href: "/seller/products", icon: "bi-box", label: "Products" },
    {
      href: "/seller/add-product",
      icon: "bi-plus-square",
      label: "Add Product",
    },
    {
      href: "/seller/orders",
      icon: "bi-list-check",
      label: "orders",
    },
    {
      href: "/seller/completed-orders",
      icon: "bi-check2-circle",
      label: "Completed Orders",
    },
    { href: "/seller/discounts", icon: "bi-tag", label: "Discounts" },
    { href: "/seller/settings", icon: "bi-gear", label: "Settings" },
  ];

  return (
    <div
      className="sidebar d-flex flex-column bg-dark text-white vh-100 shadow"
      style={{
        width: isCollapsed ? "80px" : "250px",
        transition: "width 0.3s ease-in-out",
      }}
    >
      {/* Toggle Sidebar Button */}
      <button
        className="btn btn-outline-light my-3 mx-auto"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <i className={`bi ${isCollapsed ? "bi-list" : "bi-x-lg"}`}></i>
      </button>

      {/* Sidebar Menu */}
      <ul className="nav flex-column px-2">
        {menuItems.map((item, index) => (
          <li key={index} className="nav-item">
            {item.useRouter ? (
              <button
                className="nav-link text-white d-flex align-items-center p-2"
                onClick={() => router.push(item.href)}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ) : (
              <Link
                href={item.href}
                className="nav-link text-white d-flex align-items-center p-2"
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="mt-auto p-3">
        <button
          className="btn btn-danger w-100 d-flex align-items-center"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
