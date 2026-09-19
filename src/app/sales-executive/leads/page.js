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
  Input,
  Select,
  Textarea,
  Button,
} from "@/components/common";
import { leadApi } from "@/services/leadApi";
import { getAuthenticatedUser } from "@/utils/auth";

export default function SalesExecutiveLeadsPage() {
  const { showToast } = useToast();

  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  // Modal states
  const [followUpLead, setFollowUpLead] = useState(null);
  const [followUpData, setFollowUpData] = useState({
    outcome: "Connected - Highly Interested",
    remarks: "",
    next_follow_up_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  });

  const [viewLead, setViewLead] = useState(null);
  const [masterStatuses, setMasterStatuses] = useState([]);

  // Load master statuses
  useEffect(() => {
    leadApi
      .getMasterData()
      .then((res) => setMasterStatuses(res.statuses || []))
      .catch(() => {});
  }, []);

  // Fetch leads assigned to logged-in user via unified leadApi
  const fetchAssignedLeads = useCallback(
    async (page = 1, perPage = pagination.per_page, search = searchTerm, currentFilters = filters) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          page,
          per_page: perPage,
        };
        if (search && search.trim()) params.search = search.trim();
        if (currentFilters.status) params.status = currentFilters.status;
        if (currentFilters.priority) params.priority = currentFilters.priority;

        const res = await leadApi.getLeads(params);
        if (res && res.status) {
          setLeads(res.data || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        console.error("Error fetching assigned leads:", err);
        setError(err.response?.data?.message || "Failed to load assigned leads.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, filters, pagination.per_page]
  );

  useEffect(() => {
    fetchAssignedLeads(1);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchAssignedLeads(1, pagination.per_page, term, filters);
  };

  const handleFilterChange = (name, value) => {
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    fetchAssignedLeads(1, pagination.per_page, searchTerm, updated);
  };

  const handleResetFilters = () => {
    const reset = { status: "", priority: "" };
    setFilters(reset);
    setSearchTerm("");
    fetchAssignedLeads(1, pagination.per_page, "", reset);
  };

  const handlePageChange = (page) => {
    fetchAssignedLeads(page, pagination.per_page, searchTerm, filters);
  };

  const handlePerPageChange = (newPerPage) => {
    fetchAssignedLeads(1, newPerPage, searchTerm, filters);
  };

  const handleWhatsApp = (lead) => {
    showToast(`Opening WhatsApp for ${lead.name}...`, "info");
    const text = encodeURIComponent(
      `Hello ${lead.name}, I am your dedicated Relationship Executive at Defence Autolink regarding your interest in ${lead.model_variant || "our vehicle lineup"}. When would be a good time for a quick chat?`
    );
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  const handleSaveFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpLead) return;

    try {
      const res = await leadApi.createFollowUp(followUpLead.id, followUpData);
      if (res && res.status) {
        showToast(`Follow-up logged for ${followUpLead.name}!`, "success");
        setFollowUpLead(null);
        setFollowUpData({
          outcome: "Connected - Highly Interested",
          remarks: "",
          next_follow_up_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        });
        fetchAssignedLeads(pagination.current_page);
      }
    } catch (err) {
      showToast("Failed to save follow-up.", "error");
    }
  };

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
              background: "linear-gradient(135deg, #58632A, #3F4912)",
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
            <div className="fw-bold text-dark small">{val}</div>
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
      label: "Vehicle Interested",
      render: (val, row) => (
        <div>
          <span className="text-dark fw-semibold small d-block">{val || "Vehicle Inquiry"}</span>
          <span className="text-primary small" style={{ fontSize: "0.75rem" }}>
            {row.brand_name || "Brand"} • {row.vehicle_segment}
          </span>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (val) => {
        if (val?.toLowerCase() === "hot") {
          return <span className="badge bg-danger-subtle text-danger"><i className="bi bi-fire me-1"></i>Hot</span>;
        }
        if (val?.toLowerCase() === "warm") {
          return <span className="badge bg-warning-subtle text-warning"><i className="bi bi-sun-fill me-1"></i>Warm</span>;
        }
        return <span className="badge bg-info-subtle text-info"><i className="bi bi-snow me-1"></i>Cold</span>;
      },
    },
    {
      key: "status_name",
      label: "Status",
      render: (val) => (
        <span className="badge-custom badge-active">
          <span className="badge-dot-indicator"></span>
          {val || "New Lead"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Assigned Date",
      render: (val) => (
        <span className="text-muted small">
          {val ? new Date(val).toLocaleDateString("en-IN") : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Quick Actions",
      align: "end",
      render: (val, row) => (
        <div className="d-inline-flex align-items-center gap-1">
          <Button
            variant="outline-success"
            size="xs"
            icon="bi-whatsapp"
            title="Chat on WhatsApp"
            onClick={() => handleWhatsApp(row)}
          />

          <Button
            variant="outline-primary"
            size="xs"
            icon="bi-telephone-plus"
            title="Log Call Outcome"
            onClick={() => setFollowUpLead(row)}
          />

          <Button
            variant="outline-secondary"
            size="xs"
            icon="bi-eye"
            title="View Details"
            onClick={() => setViewLead(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="page-body">
        {/* Page Header */}
        <div className="page-header-wrapper">
          <div>
            <ul className="breadcrumb-custom">
              <li className="breadcrumb-item">
                <Link href="/sales-executive/dashboard">Sales Desk</Link>
              </li>
              <li className="breadcrumb-item active">My Assigned Leads</li>
            </ul>
            <h1 className="page-title mt-1">My Assigned Leads Pipeline</h1>
          </div>

          <div className="page-header-actions d-flex align-items-center gap-2">
            <Link href="/sales-executive/dashboard" className="btn btn-outline-custom">
              <i className="bi bi-grid-1x2-fill"></i>
              <span>Sales Dashboard</span>
            </Link>
            <Link href="/admin/quotation" className="btn btn-primary">
              <i className="bi bi-file-earmark-spreadsheet-fill"></i>
              <span>Create Quotation</span>
            </Link>
          </div>
        </div>

        {/* Lead Table Card */}
        <div className="card mb-4">
          <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex flex-wrap align-items-center gap-2 flex-grow-1">
              <Search
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Search my leads..."
                width="280px"
              />

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
                    name: "status",
                    label: "Status",
                    options: masterStatuses.map((s) => ({ value: s.name, label: s.name })),
                    width: "150px",
                  },
                ]}
                values={filters}
                onChange={handleFilterChange}
                onClear={handleResetFilters}
              />
            </div>

            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">
              {pagination.total} Assigned Leads
            </span>
          </div>

          <Table
            columns={columns}
            data={leads}
            loading={isLoading}
            error={error}
            onRetry={() => fetchAssignedLeads(pagination.current_page)}
            emptyTitle="No assigned leads found"
            emptyDescription="You currently do not have leads matching the filter."
          />

          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            perPage={pagination.per_page}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            itemName="assigned leads"
          />
        </div>

        {/* Follow-Up Modal */}
        {followUpLead && (
          <Modal
            isOpen={!!followUpLead}
            onClose={() => setFollowUpLead(null)}
            title={`Log Call Outcome: ${followUpLead.name}`}
            icon="bi-telephone-plus-fill"
          >
            <form onSubmit={handleSaveFollowUp}>
              <div className="p-2 rounded-3 mb-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                <div className="fw-bold text-dark">{followUpLead.name} ({followUpLead.phone})</div>
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

<<<<<<< HEAD
        {/* Desktop Table View (Hidden on mobile) */}
        {!isLoading && leads.length > 0 && (
          <div className="d-none d-lg-block">
            <div className="card rounded-3 overflow-hidden shadow-sm">
              <div className="table-responsive">
                <table className="table table-custom align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="py-3 px-3">Lead & Contact</th>
                      <th className="py-3 px-3">Vehicle Requirement</th>
                      <th className="py-3 px-3">Priority</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Next Follow-Up</th>
                      <th className="py-3 px-3 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        {/* Lead & Contact */}
                        <td className="py-3 px-3">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="fw-bold fs-6" style={{ color: "var(--text-primary)" }}>{lead.name}</span>
                            {lead.is_birthday_today && (
                              <span className="badge bg-danger-subtle text-danger px-2 py-0" style={{ fontSize: "10px" }}>
                                🎂 Birthday Today
                              </span>
                            )}
                            {lead.is_anniversary_today && (
                              <span className="badge bg-primary-subtle text-primary px-2 py-0" style={{ fontSize: "10px" }}>
                                💐 Anniversary Today
                              </span>
                            )}
                          </div>
                          <div className="text-secondary small mt-1">
                            <i className="bi bi-telephone-fill me-1"></i>
                            <a href={`tel:${lead.phone}`} className="text-decoration-none" style={{ color: "var(--text-primary)" }}>
                              {lead.phone}
                            </a>
                            {lead.email && <span className="ms-2">• {lead.email}</span>}
                          </div>
                          {lead.city && (
                            <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                              <i className="bi bi-geo-alt-fill me-1"></i>
                              {lead.city}
                              {lead.state ? `, ${lead.state}` : ""}
                            </div>
                          )}
                        </td>

                        {/* Vehicle Requirement */}
                        <td className="py-3 px-3">
                          <div className="fw-bold" style={{ color: "var(--text-primary)" }}>
                            🚗 {lead.model_variant || "Model Not Specified"}
                          </div>
                          <div className="text-muted small">
                            {lead.brand_name ? `Brand: ${lead.brand_name}` : "Multi-Brand Search"}
                            {lead.budget ? ` • Budget: ${lead.budget}` : ""}
                          </div>
                          {lead.source && (
                            <span className="badge bg-secondary-subtle text-secondary mt-1">
                              Source: {lead.source?.title || lead.source_name || lead.source}
                            </span>
                          )}
                        </td>

                        {/* Priority Badge */}
                        <td className="py-3 px-3">
                          <span className={getPriorityBadgeClass(lead.priority)}>
                            {lead.priority || "Standard"}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-3">
                          <span className={getStatusBadgeClass(lead.status_name)}>
                            {lead.status_name || "New"}
                          </span>
                        </td>

                        {/* Next Follow-Up */}
                        <td className="py-3 px-3">
                          {lead.latest_follow_up?.next_follow_up_date ? (
                            <div>
                              <div className="fw-semibold text-warning small d-flex align-items-center gap-1">
                                <i className="bi bi-alarm"></i>
                                {lead.latest_follow_up.next_follow_up_date}
                              </div>
                              {lead.latest_follow_up.next_follow_up_time && (
                                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                                  at {lead.latest_follow_up.next_follow_up_time}
                                </div>
                              )}
                              {lead.latest_follow_up.notes && (
                                <div className="text-muted text-truncate" style={{ maxWidth: "160px", fontSize: "0.72rem" }} title={lead.latest_follow_up.notes}>
                                  &quot;{lead.latest_follow_up.notes}&quot;
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted small">No scheduled call</span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3 px-3 text-end">
                          <div className="d-inline-flex align-items-center gap-2">
                            <Link
                              href={`/admin/quotation/create?lead_id=${lead.id}`}
                              className="btn btn-outline-custom btn-sm px-3 rounded-pill d-inline-flex align-items-center gap-1"
                              title="Send Quotation"
                            >
                              <i className="bi bi-file-earmark-spreadsheet-fill text-warning"></i>
                              <span>Send Quote</span>
                            </Link>
                            <Link
                              href={`/sales-executive/leads/${lead.id}`}
                              className="btn btn-primary btn-sm px-3 rounded-pill"
                            >
                              <span>View Lead</span>
                              <i className="bi bi-arrow-right ms-1"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
=======
              <div className="mb-3">
                <Input
                  label="Next Follow-Up Date"
                  name="next_follow_up_date"
                  type="date"
                  value={followUpData.next_follow_up_date}
                  onChange={(e) => setFollowUpData({ ...followUpData, next_follow_up_date: e.target.value })}
                />
>>>>>>> 77dd084e8ac8c536104b3149b130956b57d9a25f
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

        {/* View Modal */}
        {viewLead && (
          <Modal
            isOpen={!!viewLead}
            onClose={() => setViewLead(null)}
            title={`Lead Details: ${viewLead.name}`}
            icon="bi-person-badge-fill"
            footer={
              <div className="d-flex justify-content-between w-100">
                <Button variant="outline-success" size="sm" icon="bi-whatsapp" onClick={() => handleWhatsApp(viewLead)}>
                  WhatsApp Chat
                </Button>
                <Button variant="outline-custom" size="sm" onClick={() => setViewLead(null)}>
                  Close
                </Button>
              </div>
            }
          >
            <div className="row g-3">
              <div className="col-12">
                <div className="p-3 rounded-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                  <div className="fw-bold text-dark fs-6">{viewLead.name}</div>
                  <div className="text-muted small">{viewLead.phone} • {viewLead.email || "No email"}</div>
                  <div className="text-primary small mt-2">{viewLead.model_variant} ({viewLead.vehicle_segment})</div>
                  <div className="text-warning small">Priority: {viewLead.priority} • Status: {viewLead.status_name}</div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}
