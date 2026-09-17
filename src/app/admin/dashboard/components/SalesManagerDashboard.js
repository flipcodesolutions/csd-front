"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/app/components/Toast";

export default function SalesManagerDashboard() {
  const { showToast } = useToast();

  // State for interactive discount approvals
  const [discountRequests, setDiscountRequests] = useState([
    {
      id: "REQ-101",
      customer: "Kunal Singhania",
      phone: "+91 98112 33445",
      vehicle: "Mahindra Thar Roxx AX7L 4x4",
      exShowroom: "₹22,49,000",
      discountRequested: "₹45,000 Special Dealership Off",
      requestedBy: "David Miller",
      reason: "Customer ready for on-spot booking if approved",
      status: "Pending",
    },
    {
      id: "REQ-102",
      customer: "Dr. Meenakshi Sundaram",
      phone: "+91 97234 55667",
      vehicle: "Tata Safari Adventure Plus Dark AT",
      exShowroom: "₹24,85,000",
      discountRequested: "₹35,000 Corporate & Exchange Bonus",
      requestedBy: "Rahul Verma",
      reason: "Doctor Corporate Discount + Old City Exchange",
      status: "Pending",
    },
    {
      id: "REQ-103",
      customer: "Arjun Rampal",
      phone: "+91 99887 66554",
      vehicle: "Maruti Grand Vitara Alpha Hybrid",
      exShowroom: "₹19,75,000",
      discountRequested: "₹25,000 Extended Warranty + Acc Package",
      requestedBy: "Vikram Singh",
      reason: "Matching competitor quotation from NEXA West",
      status: "Pending",
    },
  ]);

  // State for interactive unassigned leads
  const [unassignedLeads, setUnassignedLeads] = useState([
    {
      id: 201,
      name: "Gaurav Kapoor",
      phone: "+91 98450 11990",
      vehicle: "Hyundai Creta SX (O) Turbo Petrol",
      budget: "₹20 - 22 Lakhs",
      source: "Website Meta Ad",
      priority: "Hot",
      time: "15 mins ago",
    },
    {
      id: 202,
      name: "Siddharth Malhotra",
      phone: "+91 99123 44882",
      vehicle: "Royal Enfield Classic 350 Dual Channel",
      budget: "₹2.4 Lakhs",
      source: "Showroom Walk-in",
      priority: "Hot",
      time: "32 mins ago",
    },
    {
      id: 203,
      name: "Pooja Banerjee",
      phone: "+91 98332 77110",
      vehicle: "Tata Nexon EV Empowered Plus",
      budget: "₹18 Lakhs",
      source: "CarDekho Inflow",
      priority: "Warm",
      time: "1 hour ago",
    },
  ]);

  // Selected lead for allocation modal
  const [assignModalLead, setAssignModalLead] = useState(null);
  const [selectedRep, setSelectedRep] = useState("Rahul Verma");

  const handleApproveDiscount = (reqId, customer) => {
    setDiscountRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: "Approved" } : r))
    );
    showToast(`Quotation discount approved for ${customer}! Notification sent to Sales Executive.`, "success");
  };

  const handleRejectDiscount = (reqId, customer) => {
    setDiscountRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: "Rejected" } : r))
    );
    showToast(`Discount request for ${customer} has been rejected.`, "info");
  };

  const handleConfirmAssign = (e) => {
    e.preventDefault();
    if (!assignModalLead) return;
    setUnassignedLeads((prev) => prev.filter((l) => l.id !== assignModalLead.id));
    showToast(`Lead for ${assignModalLead.name} successfully assigned to ${selectedRep}!`, "success");
    setAssignModalLead(null);
  };

  return (
    <div>
      {/* 4 Team KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Team Active Pipeline</span>
              <div className="stat-icon-box primary">
                <i className="bi bi-funnel-fill"></i>
              </div>
            </div>
            <div className="stat-card-value">264 Leads</div>
            <div className="stat-change positive">
              <i className="bi bi-currency-rupee"></i>
              <span>₹18.6 Cr Pipeline Value</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Monthly Target Progress</span>
              <div className="stat-icon-box success">
                <i className="bi bi-bullseye"></i>
              </div>
            </div>
            <div className="stat-card-value">84.5%</div>
            <div className="stat-change positive">
              <i className="bi bi-check2-circle"></i>
              <span>54 / 64 Units Booked</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Unassigned Leads</span>
              <div className="stat-icon-box warning">
                <i className="bi bi-person-exclamation"></i>
              </div>
            </div>
            <div className="stat-card-value text-warning">{unassignedLeads.length} Inquiries</div>
            <div className="stat-change text-warning">
              <i className="bi bi-clock-history"></i>
              <span>Requires instant allocation</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Pending Discount Approvals</span>
              <div className="stat-icon-box danger">
                <i className="bi bi-tag-fill"></i>
              </div>
            </div>
            <div className="stat-card-value text-danger">
              {discountRequests.filter((r) => r.status === "Pending").length} Requests
            </div>
            <div className="stat-change positive">
              <i className="bi bi-shield-check"></i>
              <span>Manager approval required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Quota Progress & Reps Performance Leaderboard */}
      <div className="row g-4 mb-4">
        {/* Sales Reps Quota Performance */}
        <div className="col-xl-7">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0">Sales Executive Quota Leaderboard</h5>
                <span className="text-muted small">Real-time target vs actual booked units this month</span>
              </div>
              <span className="badge bg-success-subtle text-success">Target: 64 Units</span>
            </div>

            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                {/* Rep 1 */}
                <div className="p-3 rounded-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff" }}>
                        V
                      </div>
                      <div>
                        <div className="fw-bold" style={{ color: "var(--text-primary)" }}>Vikram Singh</div>
                        <span className="text-muted small">Senior Consultant • 42 Active Leads</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="text-warning fw-bold">24 / 25 Units</span>
                      <span className="badge bg-success ms-2">96% Target</span>
                    </div>
                  </div>
                  <div className="progress" style={{ height: "8px", background: "var(--border-color)" }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: "96%" }}></div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2 text-muted small" style={{ fontSize: "0.75rem" }}>
                    <span>Conversion: 38.2%</span>
                    <span>Volume: ₹3.42 Cr</span>
                    <span className="text-success">Avg Deal Cycle: 4.8 Days</span>
                  </div>
                </div>

                {/* Rep 2 */}
                <div className="p-3 rounded-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff" }}>
                        R
                      </div>
                      <div>
                        <div className="fw-bold" style={{ color: "var(--text-primary)" }}>Rahul Verma</div>
                        <span className="text-muted small">Sales Executive • 36 Active Leads</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="text-warning fw-bold">19 / 22 Units</span>
                      <span className="badge bg-success ms-2">86% Target</span>
                    </div>
                  </div>
                  <div className="progress" style={{ height: "8px", background: "var(--border-color)" }}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: "86%" }}></div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2 text-muted small" style={{ fontSize: "0.75rem" }}>
                    <span>Conversion: 32.5%</span>
                    <span>Volume: ₹2.45 Cr</span>
                    <span className="text-success">Avg Deal Cycle: 5.4 Days</span>
                  </div>
                </div>

                {/* Rep 3 */}
                <div className="p-3 rounded-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-orange)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff" }}>
                        D
                      </div>
                      <div>
                        <div className="fw-bold" style={{ color: "var(--text-primary)" }}>David Miller</div>
                        <span className="text-muted small">Sales Executive • 28 Active Leads</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="text-warning fw-bold">15 / 18 Units</span>
                      <span className="badge bg-warning ms-2 text-white">83% Target</span>
                    </div>
                  </div>
                  <div className="progress" style={{ height: "8px", background: "var(--border-color)" }}>
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: "83%" }}></div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2 text-muted small" style={{ fontSize: "0.75rem" }}>
                    <span>Conversion: 29.8%</span>
                    <span>Volume: ₹1.95 Cr</span>
                    <span className="text-warning">Avg Deal Cycle: 6.2 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unassigned Leads Fast Allocation Queue */}
        <div className="col-xl-5">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0">Unassigned Inflow Leads</h5>
                <span className="text-muted small">Direct customer inquiries waiting for executive assignment</span>
              </div>
              <span className="badge bg-danger rounded-pill">{unassignedLeads.length} Pending</span>
            </div>

            <div className="card-body">
              {unassignedLeads.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-check-circle-fill text-success fs-2 d-block mb-2"></i>
                  <div className="fw-semibold" style={{ color: "var(--text-primary)" }}>All Leads Allocated!</div>
                  <span className="small">No pending leads in allocation queue</span>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {unassignedLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-3 d-flex flex-column gap-2"
                      style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold small" style={{ color: "var(--text-primary)" }}>{lead.name}</div>
                          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                            {lead.phone} • <i className="bi bi-clock"></i> {lead.time}
                          </span>
                        </div>
                        <span className={`badge ${lead.priority === "Hot" ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-warning"} rounded-pill`}>
                          {lead.priority}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-primary small fw-semibold">{lead.vehicle}</span>
                        <button
                          type="button"
                          className="btn btn-xs btn-primary d-flex align-items-center gap-1"
                          onClick={() => setAssignModalLead(lead)}
                        >
                          <i className="bi bi-person-plus-fill"></i>
                          <span>Assign Rep</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Special Quotation Discount Approval Requests */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title mb-0">Quotation Special Discount Approval Requests</h5>
            <span className="text-muted small">Executive discount requests requiring Sales Manager clearance</span>
          </div>
          <span className="badge bg-warning-subtle text-warning">
            {discountRequests.filter((r) => r.status === "Pending").length} Actionable
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-custom">
            <thead>
              <tr>
                <th>Request ID & Customer</th>
                <th>Vehicle & Ex-Showroom</th>
                <th>Discount Requested</th>
                <th>Executive & Justification</th>
                <th>Status</th>
                <th className="text-end">Approval Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <div className="text-white fw-bold small">{req.customer}</div>
                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {req.id} • {req.phone}
                    </span>
                  </td>
                  <td>
                    <span className="text-white fw-semibold small">{req.vehicle}</span>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Ex-Showroom: {req.exShowroom}
                    </div>
                  </td>
                  <td>
                    <span className="text-warning fw-bold small">{req.discountRequested}</span>
                  </td>
                  <td>
                    <span className="text-white small fw-semibold">{req.requestedBy}</span>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      &quot;{req.reason}&quot;
                    </div>
                  </td>
                  <td>
                    {req.status === "Pending" && (
                      <span className="badge bg-warning-subtle text-warning">Pending Review</span>
                    )}
                    {req.status === "Approved" && (
                      <span className="badge bg-success-subtle text-success">
                        <i className="bi bi-check-circle me-1"></i>Approved
                      </span>
                    )}
                    {req.status === "Rejected" && (
                      <span className="badge bg-danger-subtle text-danger">
                        <i className="bi bi-x-circle me-1"></i>Rejected
                      </span>
                    )}
                  </td>
                  <td className="text-end">
                    {req.status === "Pending" ? (
                      <div className="d-inline-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-xs btn-success d-flex align-items-center gap-1"
                          onClick={() => handleApproveDiscount(req.id, req.customer)}
                        >
                          <i className="bi bi-check-lg"></i>
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => handleRejectDiscount(req.id, req.customer)}
                        >
                          <i className="bi bi-x-lg"></i>
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted small">Decision Recorded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Allocation Modal */}
      {assignModalLead && (
        <div className="modal-backdrop-custom" onClick={() => setAssignModalLead(null)}>
          <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5 className="modal-title-custom">
                <i className="bi bi-person-check-fill text-primary"></i> Assign Lead to Sales Executive
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setAssignModalLead(null)}
              ></button>
            </div>

            <form onSubmit={handleConfirmAssign}>
              <div className="modal-body-custom">
                <div className="p-3 rounded-3 mb-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                  <div className="fw-bold" style={{ color: "var(--text-primary)" }}>{assignModalLead.name}</div>
                  <div className="text-muted small">{assignModalLead.phone} • {assignModalLead.vehicle}</div>
                  <div className="text-warning small mt-1">Budget: {assignModalLead.budget} • Source: {assignModalLead.source}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Select Sales Representative *</label>
                  <select
                    className="form-select"
                    value={selectedRep}
                    onChange={(e) => setSelectedRep(e.target.value)}
                  >
                    <option value="Rahul Verma">Rahul Verma (19 Deals • 36 Active Leads)</option>
                    <option value="David Miller">David Miller (15 Deals • 28 Active Leads)</option>
                    <option value="Vikram Singh">Vikram Singh (24 Deals • 42 Active Leads)</option>
                    <option value="Sneha Joshi">Sneha Joshi (12 Deals • 20 Active Leads)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={() => setAssignModalLead(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check-circle me-1"></i> Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
