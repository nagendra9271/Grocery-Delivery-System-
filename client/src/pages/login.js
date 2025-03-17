"use client";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/authContext";
import Link from "next/link";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      // ✅ Debug request payload before sending
      console.log("Sending request:", data);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ Debug API response
      console.log("Response received:", response.data);

      toast.success("Login successful!", { autoClose: 2000 });

      // ✅ Call context login function
      login(response.data.token, data.role, response.data.user);

      // ✅ Redirect based on role
      if (data.role === "student") {
        router.push("/student/dashboard");
      } else {
        router.push("/seller/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      // ✅ Proper error handling
      if (error.response) {
        setServerError(error.response.data.error || "Invalid credentials.");
        toast.error(error.response.data.error || "Login failed.");
      } else {
        setServerError("Something went wrong. Try again later.");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-4 shadow-lg"
        style={{ width: "350px" }}
      >
        <h2 className="text-center mb-4">Login</h2>

        {/* Role Selection */}
        <div className="mb-3">
          <label className="form-label">Login as:</label>
          <select
            className={`form-select ${errors.role ? "is-invalid" : ""}`}
            {...register("role", { required: "Role is required" })}
          >
            <option value="student">Student</option>
            <option value="seller">Seller</option>
          </select>
          {errors.role && (
            <div className="invalid-feedback">{errors.role.message}</div>
          )}
        </div>

        {/* Email Input */}
        <div className="form-floating mb-3">
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="name@example.com"
          />
          <label>Email</label>
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        {/* Password Input */}
        <div className="form-floating mb-3">
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
          />
          <label>Password</label>
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
        {/* Signup Links */}
        <p className="text-center mt-3">
          Dont have an account?{" "}
          <Link href="/student/signup" className="text-success fw-bold">
            Student Signup
          </Link>{" "}
          |{" "}
          <Link href="/seller/signup" className="text-primary fw-bold">
            Seller Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
