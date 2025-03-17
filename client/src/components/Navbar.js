"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Container,
  Nav,
  Navbar as BootstrapNavbar,
  NavDropdown,
} from "react-bootstrap";
import { useAuth } from "../context/authContext"; // ✅ Import Auth Context

export default function CustomNavbar() {
  const pathname = usePathname(); // Get current route
  const { isLoggedIn, userRole, logout } = useAuth(); // ✅ Get Auth State

  // Function to check if a link is active (exact match)
  const isActive = (href) => pathname === href;

  return (
    <BootstrapNavbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        {/* Brand Name */}
        <BootstrapNavbar.Brand
          as={Link}
          href="/"
          className="fs-3 fw-bold text-light"
        >
          🏪 College Store
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BootstrapNavbar.Collapse id="responsive-navbar-nav">
          {/* Left Side Links */}
          <Nav className="me-auto fs-5">
            <Nav.Link
              as={Link}
              href="/student/products"
              className={
                isActive("/student/products")
                  ? "active text-light"
                  : "text-secondary"
              }
            >
              Products
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/sellers"
              className={
                isActive("/sellers") ? "active text-light" : "text-secondary"
              }
            >
              Sellers
            </Nav.Link>
          </Nav>

          {/* Right Side: Login/Profile */}
          <Nav className="fs-5">
            {isLoggedIn ? (
              <NavDropdown
                title="Profile"
                className="text-light"
                menuVariant="dark"
              >
                <NavDropdown.Item
                  as={Link}
                  href={
                    userRole === "seller"
                      ? "/seller/dashboard"
                      : "/student/dashboard"
                  }
                >
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/profile">
                  Account Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link
                as={Link}
                href="/login"
                className={
                  isActive("/login") ? "text-white px-3 mx-2" : "text-secondary"
                }
              >
                Login / Signup
              </Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
