"use client";

import React from "react";
import { Modal, Button } from "react-bootstrap";
import ProductForm from "./ProductForm"; // ✅ Use common ProductForm

export default function EditProductModal({
  show,
  onClose,
  product,
  onSave,
  loading,
}) {
  if (!product) return null; // Prevent rendering empty modal

  const handleSave = (updatedProduct) => {
    onSave(updatedProduct); // ✅ Pass updated data to parent
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProductForm
          initialData={product}
          onSubmit={handleSave}
          loading={loading}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
