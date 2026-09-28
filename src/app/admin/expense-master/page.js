"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/app/components/AdminLayout";
import { useToast } from "@/app/components/Toast";
import {
  getExpenseMasters,
  saveExpenseMasters,
} from "@/utils/expenseStorage";

export default function ExpenseMasterPage() {
  const { showToast } = useToast();

  // State Management
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State - user requested only one field: "title"
  const [titleInput, setTitleInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from local storage
  const loadData = () => {
    setIsLoading(true);
    try {
      const masters = getExpenseMasters();
      setCategories(masters);
    } catch (err) {
      console.error(err);
      showToast("Error loading expense categories", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for cross-page or external changes
    const handleUpdate = () => loadData();
    window.addEventListener("csd_expense_masters_updated", handleUpdate);
    return () => {
      window.removeEventListener("csd_expense_masters_updated", handleUpdate);
    };
  }, []);

  // 1. ADD EXPENSE CATEGORY (Only title field)
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const cleanTitle = titleInput.trim();

    if (!cleanTitle) {
      showToast("Please enter an expense title.", "error");
      return;
    }

    // Check duplicate
    const exists = categories.some(
      (c) => c.title.toLowerCase() === cleanTitle.toLowerCase()
    );
    if (exists) {
      showToast(`Category "${cleanTitle}" already exists!`, "error");
      return;
    }

    setIsSubmitting(true);
    const newCategory = {
      id: `em-${Date.now()}`,
      title: cleanTitle,
      status: "Active",
      created_at: new Date().toISOString(),
    };

    const updated = [newCategory, ...categories];
    saveExpenseMasters(updated);
    setCategories(updated);
    setIsSubmitting(false);
    setShowAddModal(false);
    setTitleInput("");
    showToast(`Expense Category "${cleanTitle}" added successfully!`, "success");
  };

  // 2. EDIT EXPENSE CATEGORY
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editItem || !editItem.title.trim()) {
      showToast("Please enter a category title.", "error");
      return;
    }

    const cleanTitle = editItem.title.trim();
    // Check duplicate with others
    const exists = categories.some(
      (c) => c.id !== editItem.id && c.title.toLowerCase() === cleanTitle.toLowerCase()
    );
    if (exists) {
      showToast(`Another category with title "${cleanTitle}" already exists!`, "error");
      return;
    }

    setIsSubmitting(true);
    const updated = categories.map((c) =>
      c.id === editItem.id ? { ...c, title: cleanTitle } : c
    );
    saveExpenseMasters(updated);
    setCategories(updated);
    setIsSubmitting(false);
    setEditItem(null);
    showToast("Expense category updated successfully!", "success");
  };

  // 3. DELETE EXPENSE CATEGORY
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    const updated = categories.filter((c) => c.id !== deleteTarget.id);
    saveExpenseMasters(updated);
    setCategories(updated);
    showToast(`Category "${deleteTarget.title}" deleted successfully!`, "success");
    setDeleteTarget(null);
  };

  // Filtered by Search
  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="page-body">
        {/* Page Breadcrumbs & Header Actions */}
        <div className="page-header-wrapper">
          <div>
            <ul className="breadcrumb-custom">
              <li className="breadcrumb-item">
                <Link href="/admin/dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <span className="text-muted">Master Data</span>
              </li>
              <li className="breadcrumb-item active">Expense Master</li>
            </ul>
            <h1 className="page-title mt-1">Expense Master</h1>
            <p className="text-muted small mb-0">
              Manage master expense categories and titles used across daily accounts and billing.
            </p>
          </div>

          <div className="page-header-actions d-flex align-items-center gap-2">
            <Link
              href="/admin/expense-detail"
              className="btn btn-outline-custom d-flex align-items-center gap-2"
            >
              <i className="bi bi-journal-text text-primary"></i>
              <span>View Expense Details</span>
            </Link>

            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => {
                setTitleInput("");
                setShowAddModal(true);
              }}
            >
              <i className="bi bi-plus-circle"></i>
              <span>Add Expense Category</span>
            </button>
          </div>
        </div>

        {/* Expense Master Table Card */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <h5 className="card-title mb-0 fw-bold">Master Expense Titles</h5>
              <span className="badge bg-primary-subtle text-primary rounded-pill px-2">
                {filteredCategories.length} Categories
              </span>
            </div>

            {/* Search Bar */}
            <div style={{ minWidth: "260px" }}>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search expense title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-custom mb-0">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>#</th>
                  <th>Expense Title</th>
                  <th className="text-end" style={{ width: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Loading master categories...
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-5 text-muted">
                      <div className="mb-2">
                        <i className="bi bi-folder-x fs-1 text-secondary opacity-50"></i>
                      </div>
                      <p className="mb-2 fw-semibold">No expense categories found.</p>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setTitleInput("");
                          setShowAddModal(true);
                        }}
                      >
                        <i className="bi bi-plus-circle me-1"></i> Add Category
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category, index) => {
                    return (
                      <tr key={category.id}>
                        <td>
                          <span className="text-muted small fw-semibold">{index + 1}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                backgroundColor: "rgba(88, 99, 42, 0.1)",
                                color: "#58632A",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              <i className="bi bi-tag-fill"></i>
                            </div>
                            <span className="fw-bold text-dark">{category.title}</span>
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="table-actions justify-content-end">
                            <button
                              type="button"
                              className="btn-action btn-edit"
                              title="Edit Expense Title"
                              onClick={() =>
                                setEditItem({
                                  id: category.id,
                                  title: category.title,
                                })
                              }
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-action btn-delete"
                              title="Delete Expense Title"
                              onClick={() => setDeleteTarget(category)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==============================================================
            MODAL 1: ADD EXPENSE MASTER (Single Title Field as requested)
            ============================================================== */}
        {showAddModal && (
          <div className="modal-backdrop-custom" onClick={() => setShowAddModal(false)}>
            <div
              className="modal-dialog-custom"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "480px" }}
            >
              <div className="modal-header-custom d-flex justify-content-between align-items-center">
                <h5 className="modal-title-custom d-flex align-items-center gap-2 text-white mb-0 fs-5 fw-bold">
                  <i className="bi bi-plus-circle text-info"></i> Add Expense Category
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className="modal-body-custom py-3">
                  <div className="mb-2">
                    <label className="form-label text-dark fw-bold small">
                      Expense Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Office Rent, Electricity Bill, Staff Food..."
                      required
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      autoFocus
                    />
                    <div className="form-text text-muted small mt-1">
                      This title will be available for selection in the Expense Detail entry form.
                    </div>
                  </div>
                </div>

                <div className="modal-footer-custom d-flex justify-content-end gap-2 pt-3">
                  <button
                    type="button"
                    className="btn btn-outline-custom"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary d-inline-flex align-items-center gap-1"
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-check2"></i>
                    <span>{isSubmitting ? "Saving..." : "Save Title"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==============================================================
            MODAL 2: EDIT EXPENSE MASTER
            ============================================================== */}
        {editItem && (
          <div className="modal-backdrop-custom" onClick={() => setEditItem(null)}>
            <div
              className="modal-dialog-custom"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "480px" }}
            >
              <div className="modal-header-custom d-flex justify-content-between align-items-center">
                <h5 className="modal-title-custom d-flex align-items-center gap-2 text-white mb-0 fs-5 fw-bold">
                  <i className="bi bi-pencil-square text-info"></i> Edit Expense Category
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setEditItem(null)}
                ></button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="modal-body-custom py-3">
                  <div className="mb-2">
                    <label className="form-label text-dark fw-bold small">
                      Expense Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Office Rent, Electricity Bill..."
                      required
                      value={editItem.title}
                      onChange={(e) =>
                        setEditItem({ ...editItem, title: e.target.value })
                      }
                      autoFocus
                    />
                  </div>
                </div>

                <div className="modal-footer-custom d-flex justify-content-end gap-2 pt-3">
                  <button
                    type="button"
                    className="btn btn-outline-custom"
                    onClick={() => setEditItem(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary d-inline-flex align-items-center gap-1"
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-check2"></i>
                    <span>{isSubmitting ? "Updating..." : "Update Title"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==============================================================
            MODAL 3: DELETE CONFIRMATION
            ============================================================== */}
        {deleteTarget && (
          <div className="modal-backdrop-custom" onClick={() => setDeleteTarget(null)}>
            <div
              className="modal-dialog-custom"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "440px" }}
            >
              <div className="modal-header-custom">
                <h5 className="modal-title-custom text-danger d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill"></i> Delete Category
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setDeleteTarget(null)}
                ></button>
              </div>

              <div className="modal-body-custom">
                <p className="text-dark mb-1">
                  Are you sure you want to delete expense category:
                </p>
                <div className="p-2 my-2 bg-light rounded border fw-bold text-danger">
                  "{deleteTarget.title}"
                </div>
              </div>

              <div className="modal-footer-custom d-flex justify-content-end gap-2 pt-3">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
