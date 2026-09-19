"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/app/components/AdminLayout";
import { useToast } from "@/app/components/Toast";

export default function FollowUpPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // New Log form state
  const [callLog, setCallLog] = useState({
    customer: "Rajesh Verma",
    phone: "+91 98231 44520",
    vehicle: "Tata Safari Adventure Plus",
    outcome: "Interested / Call Back",
    nextDate: "2026-09-04",
    notes: "",
  });

  const handleLogSubmit = (e) => {
    e.preventDefault();
    showToast(`Follow-up call interaction logged for ${callLog.customer}!`, "success");
    setShowLogModal(false);
  };

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
              <li className="breadcrumb-item active">Follow-Ups</li>
            </ul>
            <h1 className="page-title mt-1">Follow-Ups & Call Notes Hub</h1>
          </div>

          <div className="page-header-actions d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-custom"
              onClick={() => showToast("Exporting follow-up schedule to CSV...", "info")}
            >
              <i className="bi bi-file-earmark-arrow-down"></i>
              <span>Export CSV</span>
            </button>
            <button className="btn btn-primary" onClick={() => setShowLogModal(true)}>
              <i className="bi bi-telephone-plus-fill"></i>
              <span>Log Follow-Up Call</span>
            </button>
          </div>
        </div>

        {/* KPI Counter Cards */}
        <div className="row g-3 mb-4">
          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card" style={{ borderLeft: "4px solid #ef4444" }}>
              <div className="stat-card-header">
                <span className="stat-card-title">Overdue Calls</span>
                <div className="stat-icon-box danger">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
              </div>
              <div className="stat-card-value">12 Overdue</div>
              <span className="text-danger small fw-semibold">Action required urgently</span>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card" style={{ borderLeft: "4px solid #fb923c" }}>
              <div className="stat-card-header">
                <span className="stat-card-title">Due Today</span>
                <div className="stat-icon-box warning">
                  <i className="bi bi-calendar-check-fill"></i>
                </div>
              </div>
              <div className="stat-card-value">18 Calls</div>
              <span className="text-warning small fw-semibold">Scheduled for today</span>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card" style={{ borderLeft: "4px solid #38bdf8" }}>
              <div className="stat-card-header">
                <span className="stat-card-title">Upcoming (7 Days)</span>
                <div className="stat-icon-box info">
                  <i className="bi bi-clock-history"></i>
                </div>
              </div>
              <div className="stat-card-value">24 Calls</div>
              <span className="text-info small fw-semibold">Pipeline nurturing</span>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card" style={{ borderLeft: "4px solid #22c55e" }}>
              <div className="stat-card-header">
                <span className="stat-card-title">Completed Today</span>
                <div className="stat-icon-box success">
                  <i className="bi bi-check2-all"></i>
                </div>
              </div>
              <div className="stat-card-value">42 Calls</div>
              <span className="text-success small fw-semibold">8 converted to test drive</span>
            </div>
          </div>
        </div>

        {/* Tab Selector & Filter Card */}
        <div className="card mb-4">
          <div className="card-body py-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div className="btn-group">
                {[
                  { id: "all", label: "All Follow-ups", count: 54 },
                  { id: "overdue", label: "Overdue", count: 12 },
                  { id: "today", label: "Due Today", count: 18 },
                  { id: "upcoming", label: "Upcoming", count: 24 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`btn btn-sm ${activeTab === tab.id ? "btn-primary" : "btn-outline-custom"}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                    <span className="badge bg-secondary-subtle text-secondary ms-1">{tab.count}</span>
                  </button>
                ))}
              </div>

              <div className="input-group" style={{ maxWidth: "320px" }}>
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search follow-ups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Follow-Ups List Table */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Follow-Up Schedule & Call Tracker</h5>
            <span className="text-muted small">Real-time interaction queue</span>
          </div>

          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Customer & Contact</th>
                  <th>Vehicle Interested</th>
                  <th>Last Call Outcome</th>
                  <th>Follow-up Due Date</th>
                  <th>Assigned Rep</th>
                  <th>Urgency</th>
                  <th className="text-end">Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {/* 1. Rajesh Verma */}
                <tr>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src="/image/avatar-1.svg" alt="Rajesh" className="avatar" />
                      <div>
                        <div className="text-dark fw-bold small">Rajesh Verma</div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          +91 98231 44520 • New Delhi
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-dark fw-semibold small">Tata Safari Adventure Plus</span>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Dark Edition Diesel AT
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-warning-subtle text-warning small">
                      <i className="bi bi-telephone-outbound me-1"></i>Trade-in Evaluation
                    </span>
                    <div className="text-muted small mt-1" style={{ fontSize: "0.75rem" }}>
                      Wants price for 2018 Creta
                    </div>
                  </td>
                  <td>
                    <div className="text-danger fw-bold small">Today • 11:30 AM</div>
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                      Scheduled by Rep
                    </span>
                  </td>
                  <td>
                    <span className="text-dark small">Vikram Singh</span>
                  </td>
                  <td>
                    <span className="badge bg-danger-subtle text-danger px-2 py-1 rounded-pill small">
                      <i className="bi bi-fire me-1"></i>High Urgency
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          setSelectedLead("Rajesh Verma");
                          setShowLogModal(true);
                        }}
                      >
                        <i className="bi bi-telephone-fill me-1"></i> Call Now
                      </button>
                      <Link href="/quotation" className="btn btn-xs btn-outline-custom">
                        <i className="bi bi-file-earmark-spreadsheet"></i>
                      </Link>
                    </div>
                  </td>
                </tr>

                {/* 2. Priya Menon */}
                <tr>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src="/image/avatar-2.svg" alt="Priya" className="avatar" />
                      <div>
                        <div className="text-dark fw-bold small">Priya Menon</div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          +91 97410 88231 • Bengaluru
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-dark fw-semibold small">Hyundai Creta SX (O) Turbo</span>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Petrol 7-Speed DCT
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-info-subtle text-info small">
                      <i className="bi bi-car-front me-1"></i>TD Request
                    </span>
                    <div className="text-muted small mt-1" style={{ fontSize: "0.75rem" }}>
                      Requested test drive at Indiranagar
                    </div>
                  </td>
                  <td>
                    <div className="text-warning fw-bold small">Today • 03:00 PM</div>
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                      Home Test Drive
                    </span>
                  </td>
                  <td>
                    <span className="text-dark small">Ananya Roy</span>
                  </td>
                  <td>
                    <span className="badge bg-warning-subtle text-warning px-2 py-1 rounded-pill small">
                      Medium
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          setSelectedLead("Priya Menon");
                          setShowLogModal(true);
                        }}
                      >
                        <i className="bi bi-telephone-fill me-1"></i> Call Now
                      </button>
                      <Link href="/quotation" className="btn btn-xs btn-outline-custom">
                        <i className="bi bi-file-earmark-spreadsheet"></i>
                      </Link>
                    </div>
                  </td>
                </tr>

                {/* 3. Amit Patel */}
                <tr>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src="/image/avatar-3.svg" alt="Amit" className="avatar" />
                      <div>
                        <div className="text-dark fw-bold small">Amit Patel</div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          +91 99012 34567 • Ahmedabad
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-dark fw-semibold small">Mahindra Thar Roxx AX7L</span>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      4x4 Diesel AT
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-success-subtle text-success small">
                      <i className="bi bi-check2-circle me-1"></i>Loan Approved
                    </span>
                    <div className="text-muted small mt-1" style={{ fontSize: "0.75rem" }}>
                      HDFC Bank sanction letter ready
                    </div>
                  </td>
                  <td>
                    <div className="text-dark fw-bold small">Tomorrow • 10:00 AM</div>
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                      Down payment collection
                    </span>
                  </td>
                  <td>
                    <span className="text-dark small">Vikram Singh</span>
                  </td>
                  <td>
                    <span className="badge bg-danger-subtle text-danger px-2 py-1 rounded-pill small">
                      <i className="bi bi-fire me-1"></i>High Urgency
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          setSelectedLead("Amit Patel");
                          setShowLogModal(true);
                        }}
                      >
                        <i className="bi bi-telephone-fill me-1"></i> Call Now
                      </button>
                      <Link href="/quotation" className="btn btn-xs btn-outline-custom">
                        <i className="bi bi-file-earmark-spreadsheet"></i>
                      </Link>
                    </div>
                  </td>
                </tr>

                {/* 4. Sunita Rao */}
                <tr>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src="/image/avatar-4.svg" alt="Sunita" className="avatar" />
                      <div>
                        <div className="text-dark fw-bold small">Sunita Rao</div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          +91 98860 11223 • Hyderabad
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-dark fw-semibold small">Maruti Grand Vitara Hybrid</span>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Alpha Strong Hybrid e-CVT
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary small">
                      <i className="bi bi-file-earmark-text me-1"></i>Quote Review
                    </span>
                    <div className="text-muted small mt-1" style={{ fontSize: "0.75rem" }}>
                      Reviewing on-road pricing sheet
                    </div>
                  </td>
                  <td>
                    <div className="text-dark fw-bold small">Sep 05, 2026</div>
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                      Follow-up on quote
                    </span>
                  </td>
                  <td>
                    <span className="text-dark small">Rohan Mehta</span>
                  </td>
                  <td>
                    <span className="badge bg-warning-subtle text-warning px-2 py-1 rounded-pill small">
                      Medium
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          setSelectedLead("Sunita Rao");
                          setShowLogModal(true);
                        }}
                      >
                        <i className="bi bi-telephone-fill me-1"></i> Call Now
                      </button>
                      <Link href="/quotation" className="btn btn-xs btn-outline-custom">
                        <i className="bi bi-file-earmark-spreadsheet"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Call Modal */}
        {showLogModal && (
          <div className="modal-backdrop-custom" onClick={() => setShowLogModal(false)}>
            <div className="modal-dialog-custom modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-custom">
                <h5 className="modal-title-custom text-white mb-0 fs-5 fw-bold" style={{ color: "#FFFFFF" }}>
                  <i className="bi bi-telephone-outbound-fill text-primary"></i> Log Call Interaction
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowLogModal(false)}
                ></button>
              </div>

              <form onSubmit={handleLogSubmit}>
                <div className="modal-body-custom">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold small">Customer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={callLog.customer}
                        onChange={(e) => setCallLog({ ...callLog, customer: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold small">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={callLog.phone}
                        onChange={(e) => setCallLog({ ...callLog, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold small">Call Outcome</label>
                      <select
                        className="form-select"
                        value={callLog.outcome}
                        onChange={(e) => setCallLog({ ...callLog, outcome: e.target.value })}
                      >
                        <option value="Interested / Call Back">Interested / Call Back</option>
                        <option value="Test Drive Requested">Test Drive Requested</option>
                        <option value="Quotation Requested">Quotation Requested</option>
                        <option value="Ready for Booking">Ready for Booking</option>
                        <option value="Not Answering / Busy">Not Answering / Busy</option>
                        <option value="Price Too High">Price Too High</option>
                        <option value="Bought Competitor Car">Bought Competitor Car</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-semibold small">Next Action Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={callLog.nextDate}
                        onChange={(e) => setCallLog({ ...callLog, nextDate: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-dark fw-semibold small">Call Notes & Conversation Summary</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Detail customer reaction, discount discussed, accessories requested, or loan requirements..."
                        value={callLog.notes}
                        onChange={(e) => setCallLog({ ...callLog, notes: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer-custom">
                  <button type="button" className="btn btn-outline-custom" onClick={() => setShowLogModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-1"></i> Save Interaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
