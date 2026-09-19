"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminLayout from "@/app/components/AdminLayout";
import { useToast } from "@/app/components/Toast";
import {
  Table,
  Pagination,
  Search,
  Filter,
  Modal,
  Form,
  Input,
  Select,
  Textarea,
  Button,
  Loading,
  EmptyState,
} from "@/components/common";
import { leadApi } from "@/services/leadApi";
import {
  getAuthenticatedUser,
  hasRole,
  hasPermission,
} from "@/utils/auth";

export default function LeadsPage() {
  const { showToast } = useToast();

  // 1. Core State
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Master Dropdown Data
  const [masterData, setMasterData] = useState({
    brands: [],
    sources: [],
    statuses: [],
    users: [],
  });

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState(null);

  // 2. Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priority: "",
    vehicle_segment: "",
    status: "",
    brand_id: "",
  });

  // 3. Selection & Bulk Action States
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [bulkAssignUser, setBulkAssignUser] = useState("");
  const [bulkAssignRemarks, setBulkAssignRemarks] = useState("");
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // 4. Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewLead, setViewLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [followUpLead, setFollowUpLead] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTriggeringWishes, setIsTriggeringWishes] = useState(false);

  // Assignment history for View Modal
  const [leadAssignmentHistory, setLeadAssignmentHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Form State for Adding New Lead
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    birth_date: "",
    anniversary_date: "",
    vehicle_segment: "4 Wheeler",
    brand_id: "",
    model_variant: "",
    priority: "Hot",
    purchase_timeline: "Immediate (Within 7 Days)",
    source_id: "",
    status_id: "",
    assigned_to: "",
  });

  // Follow-up modal form state
  const [followUpData, setFollowUpData] = useState({
    outcome: "Connected - Highly Interested",
    remarks: "",
    next_follow_up_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  });

  // Load User & Master Data on mount
  useEffect(() => {
    setCurrentUser(getAuthenticatedUser());

    leadApi
      .getMasterData()
      .then((res) => {
        setMasterData(res);
      })
      .catch((err) => console.error("Error loading master data:", err));
  }, []);

  // 5. Fetch Leads from Single Lead API
  const fetchLeads = useCallback(
    async (page = 1, perPage = pagination.per_page, search = searchTerm, currentFilters = filters) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          page,
          per_page: perPage,
        };

        if (search && search.trim()) params.search = search.trim();
        if (currentFilters.priority) params.priority = currentFilters.priority;
        if (currentFilters.vehicle_segment) params.vehicle_segment = currentFilters.vehicle_segment;
        if (currentFilters.status) params.status = currentFilters.status;
        if (currentFilters.brand_id) params.brand_id = currentFilters.brand_id;

        const response = await leadApi.getLeads(params);

        if (response && response.status) {
          setLeads(response.data || []);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError(err.response?.data?.message || "Unable to fetch leads from API.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, filters, pagination.per_page]
  );

  // Initial fetch & action check
  useEffect(() => {
    fetchLeads(1);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if ((params.get("action") === "create" || params.get("create") === "true") && hasPermission("lead.create")) {
        setShowAddModal(true);
      }
    }
  }, []);

  // Search & Filter change handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchLeads(1, pagination.per_page, term, filters);
  };

  const handleFilterChange = (name, value) => {
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    fetchLeads(1, pagination.per_page, searchTerm, updated);
  };

  const handleResetFilters = () => {
    const reset = {
      priority: "",
      vehicle_segment: "",
      status: "",
      brand_id: "",
    };
    setFilters(reset);
    setSearchTerm("");
    fetchLeads(1, pagination.per_page, "", reset);
  };

  const handlePageChange = (page) => {
    fetchLeads(page, pagination.per_page, searchTerm, filters);
  };

  const handlePerPageChange = (newPerPage) => {
    fetchLeads(1, newPerPage, searchTerm, filters);
  };

  // Row selection handlers for bulk operations
  const handleSelectRow = (rowId, row, isSelected) => {
    if (isSelected) {
      setSelectedLeadIds((prev) => [...prev, rowId]);
    } else {
      setSelectedLeadIds((prev) => prev.filter((id) => id !== rowId));
    }
  };

  const handleSelectAll = (allIds, isSelected) => {
    if (isSelected) {
      setSelectedLeadIds(allIds);
    } else {
      setSelectedLeadIds([]);
    }
  };

  // View Lead Details & History
  const handleOpenViewLead = async (lead) => {
    setViewLead(lead);
    setIsLoadingHistory(true);
    try {
      const res = await leadApi.getAssignmentHistory(lead.id);
      if (res && res.status) {
        setLeadAssignmentHistory(res.data || []);
      }
    } catch (err) {
      setLeadAssignmentHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Create Lead Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addFormData.name.trim()) {
      showToast("Please enter customer name.", "error");
      return;
    }
    if (!addFormData.phone.trim()) {
      showToast("Please enter phone number.", "error");
      return;
    }
    if (!addFormData.model_variant.trim()) {
      showToast("Please enter desired variant/model.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await leadApi.createLead(addFormData);
      if (res && res.status) {
        showToast(`Lead created for "${addFormData.name}"!`, "success");
        setShowAddModal(false);
        setAddFormData({
          name: "",
          email: "",
          phone: "",
          city: "",
          state: "",
          birth_date: "",
          anniversary_date: "",
          vehicle_segment: "4 Wheeler",
          brand_id: "",
          model_variant: "",
          priority: "Hot",
          purchase_timeline: "Immediate (Within 7 Days)",
          source_id: "",
          status_id: "",
          assigned_to: "",
        });
        fetchLeads(1);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create lead.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Lead Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editLead.name.trim() || !editLead.phone.trim()) {
      showToast("Please fill in required customer details.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await leadApi.updateLead(editLead.id, editLead);
      if (res && res.status) {
        showToast(`Lead updated for "${editLead.name}"!`, "success");
        setEditLead(null);
        fetchLeads(pagination.current_page);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update lead.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Lead
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await leadApi.deleteLead(deleteTarget.id);
      if (res && res.status) {
        showToast(`Lead for "${deleteTarget.name}" deleted.`, "success");
        setDeleteTarget(null);
        setSelectedLeadIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        fetchLeads(pagination.current_page);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete lead.", "error");
    }
  };

  // Bulk Delete
  const handleBulkDeleteConfirm = async () => {
    if (selectedLeadIds.length === 0) return;
    try {
      const res = await leadApi.bulkDelete(selectedLeadIds);
      if (res && res.status) {
        showToast(`Deleted ${selectedLeadIds.length} leads successfully.`, "success");
        setSelectedLeadIds([]);
        setShowBulkDeleteModal(false);
        fetchLeads(1);
      }
    } catch (err) {
      showToast("Bulk delete failed.", "error");
    }
  };

  // Bulk Assign
  const handleBulkAssignSubmit = async (e) => {
    e.preventDefault();
    if (!bulkAssignUser) {
      showToast("Please select a sales representative.", "error");
      return;
    }

    try {
      const res = await leadApi.bulkAssign(selectedLeadIds, bulkAssignUser, bulkAssignRemarks);
      if (res && res.status) {
        showToast(`Reassigned ${selectedLeadIds.length} leads successfully!`, "success");
        setSelectedLeadIds([]);
        setShowBulkAssignModal(false);
        setBulkAssignRemarks("");
        fetchLeads(pagination.current_page);
      }
    } catch (err) {
      showToast("Bulk assignment failed.", "error");
    }
  };

  // Quick WhatsApp Launcher
  const handleWhatsApp = (lead) => {
    showToast(`Launching WhatsApp for ${lead.name}...`, "info");
    const text = encodeURIComponent(
      `Hello ${lead.name}, thank you for your interest in ${lead.model_variant || "our vehicles"} at Defence Autolink. How may I assist you today?`
    );
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  // Quick Follow-Up Note Submit
  const handleSaveFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpLead) return;

    try {
      const res = await leadApi.createFollowUp(followUpLead.id, followUpData);
      if (res && res.status) {
        showToast(`Follow-up note saved for ${followUpLead.name}!`, "success");
        setFollowUpLead(null);
        setFollowUpData({
          outcome: "Connected - Highly Interested",
          remarks: "",
          next_follow_up_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        });
        fetchLeads(pagination.current_page);
      }
    } catch (err) {
      showToast("Failed to save follow-up.", "error");
    }
  };

  // Dispatch Birthday & Anniversary Wishes
  const handleTriggerGreetings = async () => {
    setIsTriggeringWishes(true);
    try {
      const res = await leadApi.sendGreetingsNow();
      if (res && res.status) {
        showToast(
          `Greetings sent: ${res.data?.birthday_wishes_sent || 0} Birthdays, ${res.data?.anniversary_wishes_sent || 0} Anniversaries!`,
          "success"
        );
      }
    } catch (err) {
      showToast("Greetings dispatch completed.", "info");
    } finally {
      setIsTriggeringWishes(false);
    }
  };

  // Priority Badge Helper
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "hot":
        return <span className="badge bg-danger-subtle text-danger"><i className="bi bi-fire me-1"></i>Hot</span>;
      case "warm":
        return <span className="badge bg-warning-subtle text-warning"><i className="bi bi-sun-fill me-1"></i>Warm</span>;
      case "cold":
      default:
        return <span className="badge bg-info-subtle text-info"><i className="bi bi-snow me-1"></i>Cold</span>;
    }
  };

  // 6. Define Table Columns
  const columns = [
    {
      key: "name",
      label: "Customer Details",
      render: (val, row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "0.85rem",
              flexShrink: 0,
            }}
          >
            {val ? val.charAt(0).toUpperCase() : "C"}
          </div>
          <div>
            <div className="fw-bold text-white small">{val}</div>
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>
              <i className="bi bi-telephone me-1"></i>
              {row.phone}
            </div>
            {row.city && (
              <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                {row.city}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "model_variant",
      label: "Vehicle & Segment",
      render: (val, row) => (
        <div>
          <span className="text-white fw-semibold small d-block">{val || "Vehicle Inquiry"}</span>
          <span className="text-primary small" style={{ fontSize: "0.75rem" }}>
            {row.brand_name || row.brand?.name || "Multi-Brand"} • {row.vehicle_segment}
          </span>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (val) => getPriorityBadge(val),
    },
    {
      key: "status_name",
      label: "Status",
      render: (val, row) => (
        <span className="badge-custom badge-active">
          <span className="badge-dot-indicator"></span>
          {val || row.status?.name || "New Lead"}
        </span>
      ),
    },
    {
      key: "assigned_to_display",
      label: "Assigned Rep",
      render: (val, row) => (
        <div>
          <span className="text-white small fw-medium">
            {val || row.assigned_user_name || row.assigned_user?.name || "Unassigned"}
          </span>
          {row.source_name && (
            <span className="text-muted d-block" style={{ fontSize: "0.72rem" }}>
              Src: {row.source_name}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (val) => (
        <span className="text-muted small">
          {val
            ? new Date(val).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "end",
      render: (val, row) => (
        <div className="d-inline-flex align-items-center gap-1">
          {/* Quick WhatsApp Button */}
          <Button
            variant="outline-success"
            size="xs"
            icon="bi-whatsapp"
            title="Chat on WhatsApp"
            onClick={() => handleWhatsApp(row)}
          />

          {/* Quick Call Log Button */}
          <Button
            variant="outline-primary"
            size="xs"
            icon="bi-telephone-plus"
            title="Log Call / Follow-Up"
            onClick={() => {
              setFollowUpLead(row);
              setFollowUpData({
                outcome: "Connected - Highly Interested",
                remarks: "",
                next_follow_up_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
              });
            }}
          />

          {/* View Details Button */}
          <Button
            variant="outline-secondary"
            size="xs"
            icon="bi-eye"
            title="View Lead Timeline"
            onClick={() => handleOpenViewLead(row)}
          />

          {/* Edit Button (Role Protected) */}
          {(hasPermission("lead.edit") || hasPermission("lead.edit_assigned")) && (
            <Button
              variant="outline-custom"
              size="xs"
              icon="bi-pencil"
              title="Edit Lead"
              onClick={() => setEditLead({ ...row })}
            />
          )}

          {/* Delete Button (Admin Only) */}
          {hasPermission("lead.delete") && (
            <Button
              variant="outline-danger"
              size="xs"
              icon="bi-trash"
              title="Delete Lead"
              onClick={() => setDeleteTarget(row)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="page-body">
        {/* Page Header & Action Buttons */}
        <div className="page-header-wrapper">
          <div>
            <ul className="breadcrumb-custom">
              <li className="breadcrumb-item">
                <Link href="/admin/dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item active">Leads Pipeline</li>
            </ul>
            <h1 className="page-title mt-1">
              {hasRole("sales_executive") ? "My Assigned Leads Pipeline" : "Dealership Leads Master"}
            </h1>
          </div>

          <div className="page-header-actions d-flex align-items-center gap-2">
            {/* Automated Greetings Dispatcher */}
            {hasPermission("lead.send_greetings") && (
              <Button
                variant="outline-custom"
                size="sm"
                icon="bi-gift-fill text-warning"
                loading={isTriggeringWishes}
                loadingText="Sending Wishes..."
                onClick={handleTriggerGreetings}
                title="Send automated Birthday & Anniversary WhatsApp/SMS wishes"
              >
                Trigger Greetings
              </Button>
            )}

            {/* Export CSV */}
            {hasPermission("lead.export") && (
              <Button
                variant="outline-custom"
                size="sm"
                icon="bi-file-earmark-arrow-down"
                onClick={() => showToast("Exporting leads pipeline to CSV...", "info")}
              >
                Export CSV
              </Button>
            )}

            {/* Add New Lead */}
            {hasPermission("lead.create") && (
              <Button
                variant="primary"
                size="sm"
                icon="bi-plus-circle"
                onClick={() => setShowAddModal(true)}
              >
                Add New Lead
              </Button>
            )}
          </div>
        </div>

        {/* Lead Table Main Card */}
        <div className="card mb-4">
          {/* Top Search, Filter & Bulk Action Toolbar */}
          <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex flex-wrap align-items-center gap-2 flex-grow-1">
              {/* Search Component */}
              <Search
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Search customer, phone, variant..."
                width="280px"
              />

              {/* Filter Component */}
              <Filter
                filters={[
                  {
                    name: "priority",
                    label: "Priority",
                    options: [
                      { value: "Hot", label: "🔥 Hot Priority" },
                      { value: "Warm", label: "☀️ Warm Priority" },
                      { value: "Cold", label: "❄️ Cold Priority" },
                    ],
                    width: "140px",
                  },
                  {
                    name: "vehicle_segment",
                    label: "Segment",
                    options: [
                      { value: "4 Wheeler", label: "🚗 4 Wheeler" },
                      { value: "2 Wheeler", label: "🏍️ 2 Wheeler" },
                    ],
                    width: "140px",
                  },
                  {
                    name: "status",
                    label: "Status",
                    options: masterData.statuses.map((s) => ({
                      value: s.name,
                      label: s.name,
                    })),
                    width: "150px",
                  },
                  {
                    name: "brand_id",
                    label: "Brand",
                    options: masterData.brands.map((b) => ({
                      value: b.id,
                      label: b.name,
                    })),
                    width: "150px",
                  },
                ]}
                values={filters}
                onChange={handleFilterChange}
                onClear={handleResetFilters}
              />
            </div>

            {/* Total Leads Counter */}
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">
                {pagination.total} Total Leads
              </span>
            </div>
          </div>

          {/* Bulk Action Bar (when rows are selected) */}
          {selectedLeadIds.length > 0 && hasPermission("lead.bulk_action") && (
            <div
              className="py-2 px-3 d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom"
              style={{ background: "rgba(88, 99, 42, 0.15)", borderColor: "var(--border-color)" }}
            >
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-check2-square text-primary fs-5"></i>
                <span className="fw-bold text-white small">
                  {selectedLeadIds.length} leads selected
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="primary"
                  size="xs"
                  icon="bi-person-check-fill"
                  onClick={() => setShowBulkAssignModal(true)}
                >
                  Bulk Reassign
                </Button>

                {hasPermission("lead.delete") && (
                  <Button
                    variant="outline-danger"
                    size="xs"
                    icon="bi-trash"
                    onClick={() => setShowBulkDeleteModal(true)}
                  >
                    Bulk Delete
                  </Button>
                )}

                <Button
                  variant="outline-secondary"
                  size="xs"
                  onClick={() => setSelectedLeadIds([])}
                >
                  Cancel Selection
                </Button>
              </div>
            </div>
          )}

          {/* Reusable Data Table */}
          <Table
            columns={columns}
            data={leads}
            loading={isLoading}
            error={error}
            onRetry={() => fetchLeads(pagination.current_page)}
            selectable={hasPermission("lead.bulk_action")}
            selectedIds={selectedLeadIds}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            emptyTitle="No customer leads found"
            emptyDescription="Try adjusting your search query or filters."
            emptyAction={
              hasPermission("lead.create") ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon="bi-plus-circle"
                  onClick={() => setShowAddModal(true)}
                >
                  Create First Lead
                </Button>
              ) : null
            }
          />

          {/* Reusable Pagination */}
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            perPage={pagination.per_page}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            itemName="leads"
          />
        </div>

        {/* ------------------------------------------------------------------
            1. ADD NEW LEAD MODAL
            ------------------------------------------------------------------ */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Customer Lead"
          icon="bi-person-plus-fill"
          size="lg"
        >
          <form onSubmit={handleAddSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <Input
                  label="Customer Full Name"
                  name="name"
                  placeholder="e.g. Vikram Sharma"
                  required
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="col-md-6">
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="customer@gmail.com"
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <Input
                  label="City / Location"
                  name="city"
                  placeholder="e.g. Ahmedabad"
                  value={addFormData.city}
                  onChange={(e) => setAddFormData({ ...addFormData, city: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <Select
                  label="Vehicle Segment"
                  name="vehicle_segment"
                  value={addFormData.vehicle_segment}
                  onChange={(e) => setAddFormData({ ...addFormData, vehicle_segment: e.target.value })}
                  options={[
                    { value: "4 Wheeler", label: "4 Wheeler (Cars & SUVs)" },
                    { value: "2 Wheeler", label: "2 Wheeler (Bikes & Scooters)" },
                  ]}
                />
              </div>

              <div className="col-md-6">
                <Select
                  label="Brand"
                  name="brand_id"
                  value={addFormData.brand_id}
                  onChange={(e) => setAddFormData({ ...addFormData, brand_id: e.target.value })}
                  options={masterData.brands.map((b) => ({ value: b.id, label: b.name }))}
                  placeholder="Select Brand..."
                />
              </div>

              <div className="col-md-6">
                <Input
                  label="Model & Variant Interested"
                  name="model_variant"
                  placeholder="e.g. Grand Vitara Alpha Hybrid"
                  required
                  value={addFormData.model_variant}
                  onChange={(e) => setAddFormData({ ...addFormData, model_variant: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <Select
                  label="Lead Source"
                  name="source_id"
                  value={addFormData.source_id}
                  onChange={(e) => setAddFormData({ ...addFormData, source_id: e.target.value })}
                  options={masterData.sources.map((s) => ({ value: s.id, label: s.title || s.name }))}
                  placeholder="Select Source..."
                />
              </div>

              <div className="col-md-6">
                <Select
                  label="Priority Level"
                  name="priority"
                  value={addFormData.priority}
                  onChange={(e) => setAddFormData({ ...addFormData, priority: e.target.value })}
                  options={[
                    { value: "Hot", label: "🔥 Hot Priority" },
                    { value: "Warm", label: "☀️ Warm Priority" },
                    { value: "Cold", label: "❄️ Cold Priority" },
                  ]}
                />
              </div>

              {hasPermission("lead.assign") && (
                <div className="col-md-6">
                  <Select
                    label="Assign to Sales Representative"
                    name="assigned_to"
                    value={addFormData.assigned_to}
                    onChange={(e) => setAddFormData({ ...addFormData, assigned_to: e.target.value })}
                    options={masterData.users
                      .filter((u) => u.role === "Sales Executive" || u.role === "Sales Manager")
                      .map((u) => ({ value: u.id, label: `${u.name} (${u.role})` }))}
                    placeholder="Auto-Assign or Select Rep..."
                  />
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2 pt-3 mt-3 border-top border-secondary-subtle">
              <Button variant="outline-custom" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting} loadingText="Creating Lead...">
                Create Lead
              </Button>
            </div>
          </form>
        </Modal>

        {/* ------------------------------------------------------------------
            2. EDIT LEAD MODAL
            ------------------------------------------------------------------ */}
        {editLead && (
          <Modal
            isOpen={!!editLead}
            onClose={() => setEditLead(null)}
            title={`Edit Lead: ${editLead.name}`}
            icon="bi-pencil-square"
            size="lg"
          >
            <form onSubmit={handleEditSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <Input
                    label="Customer Full Name"
                    name="name"
                    required
                    value={editLead.name}
                    onChange={(e) => setEditLead({ ...editLead, name: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    required
                    value={editLead.phone}
                    onChange={(e) => setEditLead({ ...editLead, phone: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={editLead.email || ""}
                    onChange={(e) => setEditLead({ ...editLead, email: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <Input
                    label="City"
                    name="city"
                    value={editLead.city || ""}
                    onChange={(e) => setEditLead({ ...editLead, city: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <Input
                    label="Desired Model & Variant"
                    name="model_variant"
                    required
                    value={editLead.model_variant}
                    onChange={(e) => setEditLead({ ...editLead, model_variant: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <Select
                    label="Priority Level"
                    name="priority"
                    value={editLead.priority}
                    onChange={(e) => setEditLead({ ...editLead, priority: e.target.value })}
                    options={[
                      { value: "Hot", label: "🔥 Hot Priority" },
                      { value: "Warm", label: "☀️ Warm Priority" },
                      { value: "Cold", label: "❄️ Cold Priority" },
                    ]}
                  />
                </div>

                <div className="col-md-6">
                  <Select
                    label="Status"
                    name="status_id"
                    value={editLead.status_id || ""}
                    onChange={(e) => setEditLead({ ...editLead, status_id: e.target.value })}
                    options={masterData.statuses.map((s) => ({ value: s.id, label: s.name }))}
                  />
                </div>

                {hasPermission("lead.assign") && (
                  <div className="col-md-6">
                    <Select
                      label="Assigned Sales Rep"
                      name="assigned_to"
                      value={editLead.assigned_to || ""}
                      onChange={(e) => setEditLead({ ...editLead, assigned_to: e.target.value })}
                      options={masterData.users
                        .filter((u) => u.role === "Sales Executive" || u.role === "Sales Manager")
                        .map((u) => ({ value: u.id, label: `${u.name} (${u.role})` }))}
                      placeholder="Select Representative..."
                    />
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 mt-3 border-top border-secondary-subtle">
                <Button variant="outline-custom" onClick={() => setEditLead(null)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={isSubmitting} loadingText="Saving Changes...">
                  Save Changes
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* ------------------------------------------------------------------
            3. VIEW LEAD TIMELINE & DETAILS MODAL
            ------------------------------------------------------------------ */}
        {viewLead && (
          <Modal
            isOpen={!!viewLead}
            onClose={() => setViewLead(null)}
            title={`Lead Details: ${viewLead.name}`}
            icon="bi-person-badge-fill"
            size="lg"
            footer={
              <div className="d-flex justify-content-between w-100 align-items-center">
                <Button
                  variant="outline-success"
                  size="sm"
                  icon="bi-whatsapp"
                  onClick={() => handleWhatsApp(viewLead)}
                >
                  WhatsApp Chat
                </Button>
                <Button variant="outline-custom" size="sm" onClick={() => setViewLead(null)}>
                  Close
                </Button>
              </div>
            }
          >
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="p-3 rounded-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                  <span className="text-muted small d-block">Customer Phone & Email</span>
                  <div className="fw-bold text-white fs-6">{viewLead.phone}</div>
                  <div className="text-muted small">{viewLead.email || "No email on record"}</div>
                  <div className="text-muted small mt-1">Location: {viewLead.city || "N/A"}, {viewLead.state || "N/A"}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 rounded-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                  <span className="text-muted small d-block">Vehicle & Segment</span>
                  <div className="fw-bold text-white fs-6">{viewLead.model_variant}</div>
                  <div className="text-primary small">{viewLead.brand_name || "Brand"} • {viewLead.vehicle_segment}</div>
                  <div className="text-warning small mt-1">Priority: {viewLead.priority} • Status: {viewLead.status_name}</div>
                </div>
              </div>
            </div>

            {/* Assignment History Records */}
            <h6 className="text-white fw-bold mb-2">
              <i className="bi bi-clock-history me-1 text-primary"></i> Assignment & Reallocation History
            </h6>
            {isLoadingHistory ? (
              <Loading text="Loading assignment history..." size="sm" />
            ) : leadAssignmentHistory.length === 0 ? (
              <p className="text-muted small mb-0">Initial assignment to {viewLead.assigned_to_display || "Sales Rep"}.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {leadAssignmentHistory.map((hist, idx) => (
                  <div
                    key={hist.id || idx}
                    className="p-2 rounded-2 d-flex justify-content-between align-items-center small"
                    style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}
                  >
                    <div>
                      <span className="text-white fw-semibold">
                        Assigned to: {hist.assigned_to_user?.name || "Representative"}
                      </span>
                      <span className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                        Remarks: {hist.remarks || "No remarks"}
                      </span>
                    </div>
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                      {hist.created_at ? new Date(hist.created_at).toLocaleDateString("en-IN") : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Modal>
        )}

        {/* ------------------------------------------------------------------
            4. QUICK FOLLOW-UP NOTE MODAL
            ------------------------------------------------------------------ */}
        {followUpLead && (
          <Modal
            isOpen={!!followUpLead}
            onClose={() => setFollowUpLead(null)}
            title={`Log Call & Follow-Up: ${followUpLead.name}`}
            icon="bi-telephone-outbound-fill"
          >
            <form onSubmit={handleSaveFollowUp}>
              <div className="p-2 rounded-3 mb-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                <div className="fw-bold text-white">{followUpLead.name} ({followUpLead.phone})</div>
                <div className="text-muted small">{followUpLead.model_variant}</div>
              </div>

              <div className="mb-3">
                <Select
                  label="Call Outcome"
                  name="outcome"
                  value={followUpData.outcome}
                  onChange={(e) => setFollowUpData({ ...followUpData, outcome: e.target.value })}
                  options={[
                    "Connected - Highly Interested",
                    "Connected - Test Drive Booked",
                    "Connected - Quotation Requested",
                    "Call Back Later",
                    "Ringing / No Answer",
                    "Not Interested / Lost to Competitor",
                  ]}
                />
              </div>

              <div className="mb-3">
                <Textarea
                  label="Call Remarks & Customer Feedback"
                  name="remarks"
                  placeholder="Enter feedback on pricing, trade-in, financing discussion..."
                  value={followUpData.remarks}
                  onChange={(e) => setFollowUpData({ ...followUpData, remarks: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <Input
                  label="Next Follow-Up Date"
                  name="next_follow_up_date"
                  type="date"
                  value={followUpData.next_follow_up_date}
                  onChange={(e) => setFollowUpData({ ...followUpData, next_follow_up_date: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary-subtle">
                <Button variant="outline-custom" onClick={() => setFollowUpLead(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Follow-Up
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* ------------------------------------------------------------------
            5. BULK ASSIGN MODAL
            ------------------------------------------------------------------ */}
        {showBulkAssignModal && (
          <Modal
            isOpen={showBulkAssignModal}
            onClose={() => setShowBulkAssignModal(false)}
            title={`Bulk Reassign ${selectedLeadIds.length} Leads`}
            icon="bi-people-fill"
          >
            <form onSubmit={handleBulkAssignSubmit}>
              <div className="mb-3">
                <Select
                  label="Select Target Sales Representative"
                  name="bulkAssignUser"
                  required
                  value={bulkAssignUser}
                  onChange={(e) => setBulkAssignUser(e.target.value)}
                  options={masterData.users
                    .filter((u) => u.role === "Sales Executive" || u.role === "Sales Manager")
                    .map((u) => ({ value: u.id, label: `${u.name} (${u.role})` }))}
                  placeholder="Choose representative..."
                />
              </div>

              <div className="mb-3">
                <Textarea
                  label="Assignment Remarks / Instructions"
                  name="bulkAssignRemarks"
                  placeholder="e.g. Reassigned for urgent festival campaign follow-up"
                  value={bulkAssignRemarks}
                  onChange={(e) => setBulkAssignRemarks(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary-subtle">
                <Button variant="outline-custom" onClick={() => setShowBulkAssignModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Confirm Reassignment
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* ------------------------------------------------------------------
            6. DELETE CONFIRMATION MODALS
            ------------------------------------------------------------------ */}
        {deleteTarget && (
          <Modal
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            title="Confirm Delete Lead"
            icon="bi-exclamation-triangle-fill text-danger"
            size="sm"
          >
            <p className="text-muted small mb-3">
              Are you sure you want to delete lead <strong className="text-white">{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-custom" size="sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
                Delete Lead
              </Button>
            </div>
          </Modal>
        )}

        {showBulkDeleteModal && (
          <Modal
            isOpen={showBulkDeleteModal}
            onClose={() => setShowBulkDeleteModal(false)}
            title="Confirm Bulk Delete"
            icon="bi-trash-fill text-danger"
            size="sm"
          >
            <p className="text-muted small mb-3">
              Are you sure you want to permanently delete <strong className="text-white">{selectedLeadIds.length}</strong> selected leads?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-custom" size="sm" onClick={() => setShowBulkDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleBulkDeleteConfirm}>
                Delete Selected
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}
