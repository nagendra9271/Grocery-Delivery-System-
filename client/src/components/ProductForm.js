"use client";

import React, { useState } from "react";

export default function ProductForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialData);

  const categories = [
    "Groceries",
    "Snacks",
    "Beverages",
    "Dairy Products",
    "Personal Care",
    "Household Essentials",
    "Stationery",
  ]; // ✅ Category Options

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // ✅ Pass form data to parent component
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
      {/* Product Name */}
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label>Product Name</label>
      </div>

      {/* Description */}
      <div className="form-floating mb-3">
        <textarea
          className="form-control"
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ height: "100px" }}
        ></textarea>
        <label>Product Description</label>
      </div>

      {/* Price */}
      <div className="form-floating mb-3">
        <input
          type="number"
          className="form-control"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <label>Price ($)</label>
      </div>

      {/* ✅ Category Dropdown */}
      <div className="form-floating mb-3">
        <select
          className="form-select"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label>Category</label>
      </div>

      {/* Inventory */}
      <div className="form-floating mb-3">
        <input
          type="number"
          className="form-control"
          name="inventory"
          placeholder="Stock Quantity"
          value={formData.inventory}
          onChange={handleChange}
          required
        />
        <label>Stock Quantity</label>
      </div>

      {/* Submit Button */}
      <div className="d-flex w-100 justify-content-center">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Processing..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
