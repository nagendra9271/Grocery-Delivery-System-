import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useApi";

export default function SellerSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { request, loading, error } = useApi("http://localhost:5000/api");
  const router = useRouter();
  const [serverError, setServerError] = useState(null);
  const [open24, setOpen24] = useState(false); // Open 24 Hours state

  const onSubmit = async (data) => {
    setServerError(null);

    // If Open 24 Hours is checked, remove opening & closing time
    if (open24) {
      data = {
        ...data,
        open24: true,
      };
    }
    const response = await request("POST", "/auth/seller-signup", data);

    if (response?.message) {
      toast.success(response.message, { autoClose: 2000 });

      // Redirect to login page after 2 seconds
      setTimeout(() => router.push("/login"), 2000);
    } else {
      const errorMsg = response?.error || "Signup failed. Try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-4 shadow-lg"
        style={{ width: "500px" }}
      >
        <h2 className="text-center mb-4">Seller Signup</h2>

        {/* Store Name */}
        <div className="form-floating mb-3">
          <input
            {...register("store_name", { required: "Store name is required" })}
            type="text"
            className={`form-control ${errors.store_name ? "is-invalid" : ""}`}
            placeholder="Store Name"
          />
          <label>Store Name</label>
          {errors.store_name && (
            <div className="invalid-feedback">{errors.store_name.message}</div>
          )}
        </div>

        {/* Full Name */}
        <div className="form-floating mb-3">
          <input
            {...register("name", { required: "Full name is required" })}
            type="text"
            className="form-control"
            placeholder="Full Name"
          />
          <label>Full Name</label>
        </div>

        {/* Email */}
        <div className="form-floating mb-3">
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            className="form-control"
            placeholder="name@example.com"
          />
          <label>Email</label>
        </div>

        {/* Password */}
        <div className="form-floating mb-3">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            type="password"
            className="form-control"
            placeholder="Password"
          />
          <label>Password</label>
        </div>

        {/* Contact Number */}
        <div className="form-floating mb-3">
          <input
            {...register("contactNumber", {
              required: "Contact number is required",
            })}
            type="text"
            className="form-control"
            placeholder="Contact Number"
          />
          <label>Contact Number</label>
        </div>

        {/* Operating Hours Section */}
        <h5 className="mt-3">Operating Hours</h5>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="open24"
            checked={open24}
            onChange={() => setOpen24(!open24)}
          />
          <label className="form-check-label" htmlFor="open24">
            Open 24 Hours
          </label>
        </div>

        {!open24 && (
          <div className="row">
            {/* Opening Time */}
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  {...register("openingTime", {
                    required: "Opening time is required",
                  })}
                  type="time"
                  className={`form-control ${
                    errors.openingTime ? "is-invalid" : ""
                  }`}
                />
                <label>Opening Time</label>
                {errors.openingTime && (
                  <div className="invalid-feedback">
                    {errors.openingTime.message}
                  </div>
                )}
              </div>
            </div>

            {/* Closing Time */}
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  {...register("closingTime", {
                    required: "Closing time is required",
                  })}
                  type="time"
                  className={`form-control ${
                    errors.closingTime ? "is-invalid" : ""
                  }`}
                />
                <label>Closing Time</label>
                {errors.closingTime && (
                  <div className="invalid-feedback">
                    {errors.closingTime.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Address Fields */}
        <h5 className="mt-3">Address</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                {...register("pincode", {
                  required: "Pincode is required",
                  pattern: { value: /^\d{6}$/, message: "Must be 6 digits" },
                })}
                type="text"
                className="form-control"
                placeholder="Pincode"
              />
              <label>Pincode</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                {...register("street", { required: "Street is required" })}
                type="text"
                className="form-control"
                placeholder="Street"
              />
              <label>Street</label>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                {...register("city", { required: "City is required" })}
                type="text"
                className="form-control"
                placeholder="City"
              />
              <label>City</label>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                {...register("state", { required: "State is required" })}
                type="text"
                className="form-control"
                placeholder="State"
              />
              <label>State</label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-center align-items-center w-100">
          <button
            type="submit"
            className="btn btn-warning w-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/seller/login" className="text-primary fw-bold">
            Login
          </a>
          .
        </p>
      </form>
    </div>
  );
}
