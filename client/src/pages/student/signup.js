import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useApi";

export default function StudentSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { request, loading, error } = useApi("http://localhost:5000/api");
  const router = useRouter();
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);
    const response = await request("POST", "/auth/student-signup", data);

    if (response?.message) {
      toast.success(response.message, { autoClose: 2000 });

      // Redirect to login page after a short delay
      setTimeout(() => router.push("/login"), 2000);
    } else {
      const errorMsg = response?.error || "Signup failed. Try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Form fields configuration
  const formFields = [
    {
      name: "collegeId",
      label: "College ID",
      type: "text",
      placeholder: "College ID",
      validation: { required: "College ID is required" },
    },
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Full Name",
      validation: { required: "Full Name is required" },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "name@example.com",
      validation: { required: "Email is required" },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Password",
      validation: {
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters long",
        },
      },
    },
    {
      name: "contactNumber",
      label: "contactNumber",
      type: "contactNumber",
      placeholder: "",
      validation: { required: "contactNumber is required" },
    },
  ];

  // Address fields configuration
  const addressFields = [
    {
      name: "pincode",
      label: "Pincode",
      type: "text",
      placeholder: "6-digit PIN",
      validation: {
        required: "Pincode is required",
        pattern: { value: /^\d{6}$/, message: "Pincode must be 6 digits" },
      },
    },
    {
      name: "street",
      label: "Street",
      type: "text",
      placeholder: "Street",
      validation: { required: "Street is required" },
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "City",
      validation: { required: "City is required" },
    },
    {
      name: "state",
      label: "State",
      type: "text",
      placeholder: "State",
      validation: { required: "State is required" },
    },
  ];

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-4 shadow-lg"
        style={{ width: "500px" }}
      >
        <h2 className="text-center mb-4">Student Signup</h2>

        {/* Render form fields dynamically */}
        {formFields.map((field) => (
          <div className="form-floating mb-3" key={field.name}>
            <input
              {...register(field.name, field.validation)}
              type={field.type}
              className={`form-control ${
                errors[field.name] ? "is-invalid" : ""
              }`}
              placeholder={field.placeholder}
            />
            <label>{field.label}</label>
            {errors[field.name] && (
              <div className="invalid-feedback">
                {errors[field.name].message}
              </div>
            )}
          </div>
        ))}

        {/* Address Fields in a Grid Layout */}
        <div className="row">
          {addressFields.map((field) => (
            <div className="col-md-6" key={field.name}>
              <div className="form-floating mb-3">
                <input
                  {...register(field.name, field.validation)}
                  type={field.type}
                  className={`form-control ${
                    errors[field.name] ? "is-invalid" : ""
                  }`}
                  placeholder={field.placeholder}
                />
                <label>{field.label}</label>
                {errors[field.name] && (
                  <div className="invalid-feedback">
                    {errors[field.name].message}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-center align-items-center w-100">
          <button
            type="submit"
            className="btn btn-success w-50"
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

        {/* Login Link */}
        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/student/login" className="text-primary fw-bold">
            Login
          </a>
          .
        </p>
      </form>
    </div>
  );
}
