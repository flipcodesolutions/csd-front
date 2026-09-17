"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/app/components/Toast";

export default function SalesExecutiveDashboard() {
  const { showToast } = useToast();

  // State for interactive calls
  const [calls, setCalls] = useState([
    {
      id: 1,
      name: "Rajesh Verma",
      phone: "+91 98231 44520",
      vehicle: "Tata Safari Adventure Plus Dark AT",
      lastNote: "Inquired about Diwali delivery & trade-in value of 2019 Creta",
      priority: "Hot",
      timeDue: "11:30 AM (Overdue 15m)",
      status: "Pending",
    },
    {
      id: 2,
      name: "Priya Menon",
      phone: "+91 97410 88231",
      vehicle: "Hyundai Creta SX (O) Turbo Petrol",
      lastNote: "Test drive done on Saturday. Follow up on down payment and loan quote",
      priority: "Warm",
      timeDue: "02:00 PM Today",
      status: "Pending",
    },
    {
      id: 3,
      name: "Amit Patel",
      phone: "+91 99012 34567",
      vehicle: "Mahindra Thar Roxx AX7L 4x4",
      lastNote: "Quotation sent. Customer comparing with Scorpio N Z8L",
      priority: "Hot",
      timeDue: "04:30 PM Today",
      status: "Pending",
    },
    {
      id: 4,
      name: "Karthik Iyer",
      phone: "+91 94480 55678",
      vehicle: "Royal Enfield Classic 350 Dual Channel",
      lastNote: "Looking for Stealth Black variant on EMI. Needs banker callback",
      priority: "Warm",
      timeDue: "05:15 PM Today",
      status: "Pending",
    },
  ]);

  // Log Call Modal State
  const [logCallModal, setLogCallModal] = useState(null);
  const [callOutcome, setCallOutcome] = useState("Connected - Positive");
  const [callNote, setCallNote] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("2026-09-18");

  const handleWhatsAppCustomer = (name, phone, vehicle) => {
    showToast(`Launching WhatsApp chat for ${name} (${phone})...`, "success");
    const text = encodeURIComponent(`Hello ${name}, thank you for reaching out to Defence Autolink regarding ${vehicle}. I am your dedicated relationship executive.`);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  const handleSaveCallLog = (e) => {
    e.preventDefault();
    if (!logCallModal) return;
    setCalls((prev) =>
      prev.map((c) => (c.id === logCallModal.id ? { ...c, status: "Completed" } : c))
    );
    showToast(`Call note logged for ${logCallModal.name}: "${callOutcome}"!`, "success");
    setLogCallModal(null);
    setCallNote("");
  };

  return (
    <div>
      {/* 4 Personal KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">My Assigned Leads</span>
              <div className="stat-icon-box primary">
                <i className="bi bi-person-lines-fill"></i>
              </div>
            </div>
            <div className="stat-card-value">28 Active</div>
            <div className="stat-change positive">
              <i className="bi bi-fire text-danger"></i>
              <span>8 Hot Priority prospects</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Follow-Ups Due Today</span>
              <div className="stat-icon-box warning">
                <i className="bi bi-telephone-outbound-fill"></i>
              </div>
            </div>
            <div className="stat-card-value text-warning">
              {calls.filter((c) => c.status === "Pending").length} Calls
            </div>
            <div className="stat-change text-warning">
              <i className="bi bi-clock"></i>
              <span>1 urgent overdue</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Test Drives This Week</span>
              <div className="stat-icon-box info">
                <i className="bi bi-car-front-fill"></i>
              </div>
            </div>
            <div className="stat-card-value">6 Bookings</div>
            <div className="stat-change positive">
              <i className="bi bi-calendar-check"></i>
              <span>2 scheduled today</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">My Monthly Commission</span>
              <div className="stat-icon-box success">
                <i className="bi bi-cash-stack"></i>
              </div>
            </div>
            <div className="stat-card-value">₹68,500</div>
            <div className="stat-change positive">
              <i className="bi bi-trophy-fill"></i>
              <span>14 Deals Closed (92% Quota)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Quota Progress Bar */}
      <div className="card mb-4" style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", border: "1px solid #334155" }}>
        <div className="card-body py-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span className="text-white fw-bold">Personal Monthly Quota: 14 / 15 Units</span>
              <span className="text-muted small ms-2">• 1 more deal to unlock 100% Super-Incentive Tier</span>
            </div>
            <span className="badge bg-success fw-bold px-3 py-1 fs-7">93.3% Complete</span>
          </div>
          <div className="progress" style={{ height: "10px", background: "rgba(255,255,255,0.1)" }}>
            <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: "93.3%" }}></div>
          </div>
        </div>
      </div>

      {/* Today's Priority Call Queue & Scheduled Test Drives */}
      <div className="row g-4 mb-4">
        {/* Today's Call Queue */}
        <div className="col-xl-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0">Today&apos;s Follow-Up Call Queue</h5>
                <span className="text-muted small">Prioritized customer calls with instant WhatsApp & note log</span>
              </div>
              <Link href="/admin/follow-up" className="btn btn-sm btn-outline-custom">
                <span>All Follow-Ups</span>
                <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Customer & Vehicle</th>
                    <th>Last Call Note</th>
                    <th>Due Time</th>
                    <th>Status</th>
                    <th className="text-end">Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call) => (
                    <tr key={call.id}>
                      <td>
                        <div className="text-white fw-bold small">{call.name}</div>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          {call.phone}
                        </span>
                        <div className="text-info small fw-semibold mt-1">{call.vehicle}</div>
                      </td>
                      <td style={{ maxWidth: "240px" }}>
                        <p className="text-muted small mb-0 text-truncate">{call.lastNote}</p>
                        <span className={`badge ${call.priority === "Hot" ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-warning"} rounded-pill mt-1`}>
                          {call.priority}
                        </span>
                      </td>
                      <td>
                        <span className="text-warning small fw-bold">{call.timeDue}</span>
                      </td>
                      <td>
                        {call.status === "Pending" ? (
                          <span className="badge-custom badge-pending">
                            <span className="badge-dot-indicator"></span>Pending Call
                          </span>
                        ) : (
                          <span className="badge-custom badge-completed">
                            <span className="badge-dot-indicator"></span>Call Logged
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-xs btn-success"
                            title="Chat on WhatsApp"
                            onClick={() => handleWhatsAppCustomer(call.name, call.phone, call.vehicle)}
                          >
                            <i className="bi bi-whatsapp"></i>
                          </button>
                          <a
                            href={`tel:${call.phone}`}
                            className="btn btn-xs btn-primary"
                            title="Call Customer"
                            onClick={() => showToast(`Dialing ${call.name}...`, "info")}
                          >
                            <i className="bi bi-telephone-fill"></i>
                          </a>
                          <button
                            type="button"
                            className="btn btn-xs btn-outline-custom"
                            title="Log Call Result"
                            onClick={() => {
                              setLogCallModal(call);
                              setCallNote(call.lastNote);
                            }}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Scheduled Test Drives & Fast Tools */}
        <div className="col-xl-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Upcoming Test Drives</h5>
              <span className="badge bg-primary-subtle text-white">Today</span>
            </div>

            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                {/* TD 1 */}
                <div className="p-3 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary">02:30 PM Today</span>
                    <span className="text-success small fw-semibold">Car Prepped 🟢</span>
                  </div>
                  <div className="text-white fw-bold mt-2">Kunal Verma</div>
                  <div className="text-muted small">+91 98112 44332</div>
                  <div className="text-warning small fw-semibold mt-1">
                    <i className="bi bi-car-front me-1"></i> Mahindra Thar Roxx AX7L
                  </div>
                </div>

                {/* TD 2 */}
                <div className="p-3 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary">04:45 PM Today</span>
                    <span className="text-warning small fw-semibold">Trade-in Eval 🟡</span>
                  </div>
                  <div className="text-white fw-bold mt-2">Dr. Arvind Saxena</div>
                  <div className="text-muted small">+91 97120 99881</div>
                  <div className="text-warning small fw-semibold mt-1">
                    <i className="bi bi-car-front me-1"></i> Maruti Grand Vitara Alpha
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center" style={{ borderColor: "var(--border-color) !important" }}>
                <Link href="/admin/quotation" className="btn btn-sm btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                  <span>Create Fast Quotation Sheet</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Call Result Modal */}
      {logCallModal && (
        <div className="modal-backdrop-custom" onClick={() => setLogCallModal(null)}>
          <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5 className="modal-title-custom">
                <i className="bi bi-telephone-plus-fill text-primary"></i> Log Call Note for {logCallModal.name}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setLogCallModal(null)}
              ></button>
            </div>

            <form onSubmit={handleSaveCallLog}>
              <div className="modal-body-custom">
                <div className="p-2 rounded-3 mb-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                  <div className="text-white fw-bold">{logCallModal.name} ({logCallModal.phone})</div>
                  <div className="text-muted small">{logCallModal.vehicle}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-white fw-semibold small">Call Outcome *</label>
                  <select
                    className="form-select"
                    value={callOutcome}
                    onChange={(e) => setCallOutcome(e.target.value)}
                  >
                    <option value="Connected - Highly Interested">Connected - Highly Interested</option>
                    <option value="Connected - Test Drive Booked">Connected - Test Drive Booked</option>
                    <option value="Connected - Quotation Requested">Connected - Quotation Requested</option>
                    <option value="Call Back Later">Call Back Later</option>
                    <option value="Ringing / No Answer">Ringing / No Answer</option>
                    <option value="Not Interested / Lost to Competitor">Not Interested / Lost to Competitor</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-white fw-semibold small">Call Notes & Remarks</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter customer feedback, budget discussion, trade-in details..."
                    value={callNote}
                    onChange={(e) => setCallNote(e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <label className="form-label text-white fw-semibold small">Next Scheduled Follow-up</label>
                  <input
                    type="date"
                    className="form-control"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={() => setLogCallModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check-circle me-1"></i> Save Follow-Up Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
