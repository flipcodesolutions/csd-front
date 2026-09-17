"use client";

import React, { useState } from "react";
import { useToast } from "@/app/components/Toast";

export default function ReceptionistDashboard() {
  const { showToast } = useToast();

  // State for live visitor log
  const [visitors, setVisitors] = useState([
    {
      id: "WLK-042",
      name: "Harshavardhan Rao",
      phone: "+91 98450 66771",
      vehicle: "Tata Safari Dark Edition",
      assignedRep: "Vikram Singh",
      arrivalTime: "11:15 AM",
      waitTime: "10 mins",
      status: "In Discussion",
    },
    {
      id: "WLK-043",
      name: "Meera Krishnan",
      phone: "+91 97123 44556",
      vehicle: "Maruti Grand Vitara Hybrid",
      assignedRep: "Rahul Verma",
      arrivalTime: "11:22 AM",
      waitTime: "5 mins",
      status: "Waiting in Lounge",
    },
    {
      id: "WLK-044",
      name: "Sanjay Singhal",
      phone: "+91 99011 22334",
      vehicle: "Mahindra Thar Roxx 4x4",
      assignedRep: "David Miller",
      arrivalTime: "10:45 AM",
      waitTime: "40 mins",
      status: "On Test Drive",
    },
    {
      id: "WLK-045",
      name: "Rohit Deshmukh",
      phone: "+91 98220 99887",
      vehicle: "Royal Enfield Classic 350",
      assignedRep: "Sneha Joshi",
      arrivalTime: "10:10 AM",
      waitTime: "Completed",
      status: "Departed",
    },
  ]);

  // Sales rep floor status
  const [repStatus, setRepStatus] = useState([
    { name: "Vikram Singh", role: "Senior Consultant", status: "In Discussion", badge: "warning", location: "Meeting Pod 1" },
    { name: "Rahul Verma", role: "Sales Executive", status: "Available", badge: "success", location: "Floor Active" },
    { name: "David Miller", role: "Sales Executive", status: "On Test Drive", badge: "info", location: "Thar TD Route" },
    { name: "Sneha Joshi", role: "Relationship Manager", status: "Available", badge: "success", location: "Floor Active" },
  ]);

  // New Walk-in modal state
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [newWalkin, setNewWalkin] = useState({
    name: "",
    phone: "",
    vehicle: "Maruti Suzuki Grand Vitara",
    partySize: "2 Persons",
    assignedRep: "Sneha Joshi",
    source: "Direct Showroom Walk-In",
  });

  const handleRegisterWalkin = (e) => {
    e.preventDefault();
    if (!newWalkin.name || !newWalkin.phone) {
      showToast("Please enter customer name and contact number.", "warning");
      return;
    }

    const nextTokenNum = 40 + visitors.length + 1;
    const token = `WLK-0${nextTokenNum}`;

    const newEntry = {
      id: token,
      name: newWalkin.name,
      phone: newWalkin.phone,
      vehicle: newWalkin.vehicle,
      assignedRep: newWalkin.assignedRep,
      arrivalTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      waitTime: "0 mins",
      status: "Waiting in Lounge",
    };

    setVisitors([newEntry, ...visitors]);
    showToast(`Token #${token} generated for ${newWalkin.name}! Assigned to ${newWalkin.assignedRep}.`, "success");
    setShowWalkinModal(false);
    setNewWalkin({
      name: "",
      phone: "",
      vehicle: "Maruti Suzuki Grand Vitara",
      partySize: "2 Persons",
      assignedRep: "Sneha Joshi",
      source: "Direct Showroom Walk-In",
    });
  };

  const handleUpdateStatus = (visitorId, newStatus) => {
    setVisitors((prev) =>
      prev.map((v) => (v.id === visitorId ? { ...v, status: newStatus } : v))
    );
    showToast(`Visitor status updated to "${newStatus}"`, "info");
  };

  return (
    <div>
      {/* 4 Receptionist KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Today&apos;s Walk-Ins</span>
              <div className="stat-icon-box primary">
                <i className="bi bi-door-open-fill"></i>
              </div>
            </div>
            <div className="stat-card-value">24 Visitors</div>
            <div className="stat-change positive">
              <i className="bi bi-arrow-up-short"></i>
              <span>+6 vs yesterday footfall</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Active on Floor</span>
              <div className="stat-icon-box warning">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
            <div className="stat-card-value text-warning">
              {visitors.filter((v) => v.status !== "Departed").length} Parties
            </div>
            <div className="stat-change text-warning">
              <i className="bi bi-clock"></i>
              <span>Currently in showroom</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Executives Available</span>
              <div className="stat-icon-box success">
                <i className="bi bi-person-check-fill"></i>
              </div>
            </div>
            <div className="stat-card-value text-success">
              {repStatus.filter((r) => r.status === "Available").length} Reps Free
            </div>
            <div className="stat-change positive">
              <i className="bi bi-check-circle"></i>
              <span>Ready for immediate walk-in</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Average Wait Time</span>
              <div className="stat-icon-box info">
                <i className="bi bi-stopwatch-fill"></i>
              </div>
            </div>
            <div className="stat-card-value">4.2 mins</div>
            <div className="stat-change positive">
              <i className="bi bi-shield-check"></i>
              <span>SLA Target &lt; 5 mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Front-Desk Quick Action Banner */}
      <div className="card mb-4" style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", border: "1px solid #334155" }}>
        <div className="card-body py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h5 className="text-white fw-bold mb-1">Showroom Reception & Concierge Desk</h5>
            <p className="text-muted small mb-0">Register walk-in guests, generate customer tokens, and assign available executives instantly.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2"
            onClick={() => setShowWalkinModal(true)}
          >
            <i className="bi bi-plus-circle-fill fs-6"></i>
            <span className="fw-bold">New Walk-In Registration</span>
          </button>
        </div>
      </div>

      {/* Live Visitor Token Queue & Sales Rep Availability */}
      <div className="row g-4 mb-4">
        {/* Live Visitor Log */}
        <div className="col-xl-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0">Showroom Visitor Token Queue</h5>
                <span className="text-muted small">Live customer token entries and lounge stage</span>
              </div>
              <span className="badge bg-primary-subtle text-white">Live Footfall</span>
            </div>

            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Token & Customer</th>
                    <th>Interested Vehicle</th>
                    <th>Assigned Rep</th>
                    <th>Arrival & Wait</th>
                    <th>Status</th>
                    <th className="text-end">Update Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-secondary font-monospace">{v.id}</span>
                          <div>
                            <div className="text-white fw-bold small">{v.name}</div>
                            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                              {v.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white small fw-semibold">{v.vehicle}</span>
                      </td>
                      <td>
                        <span className="text-info small fw-bold">{v.assignedRep}</span>
                      </td>
                      <td>
                        <div className="text-white small">{v.arrivalTime}</div>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Wait: {v.waitTime}
                        </span>
                      </td>
                      <td>
                        {v.status === "Waiting in Lounge" && (
                          <span className="badge bg-warning-subtle text-warning">Waiting in Lounge</span>
                        )}
                        {v.status === "In Discussion" && (
                          <span className="badge bg-primary-subtle text-primary">In Discussion</span>
                        )}
                        {v.status === "On Test Drive" && (
                          <span className="badge bg-info-subtle text-info">On Test Drive</span>
                        )}
                        {v.status === "Departed" && (
                          <span className="badge bg-secondary-subtle text-muted">Departed</span>
                        )}
                      </td>
                      <td className="text-end">
                        <select
                          className="form-select form-select-sm"
                          style={{ width: "auto", display: "inline-block", background: "#181a1b", color: "#fff", borderColor: "var(--border-color)", fontSize: "0.75rem" }}
                          value={v.status}
                          onChange={(e) => handleUpdateStatus(v.id, e.target.value)}
                        >
                          <option value="Waiting in Lounge">Waiting</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="On Test Drive">Test Drive</option>
                          <option value="Departed">Departed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sales Rep Floor Availability Matrix */}
        <div className="col-xl-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Rep Floor Availability</h5>
              <span className="badge bg-success-subtle text-success">Live Floor</span>
            </div>

            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                {repStatus.map((rep, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-3 d-flex justify-content-between align-items-center"
                    style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}
                  >
                    <div>
                      <div className="text-white fw-bold small">{rep.name}</div>
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {rep.role} • {rep.location}
                      </span>
                    </div>
                    <span className={`badge bg-${rep.badge}-subtle text-${rep.badge} rounded-pill`}>
                      {rep.status === "Available" && "🟢 Free"}
                      {rep.status === "In Discussion" && "🟠 In Meeting"}
                      {rep.status === "On Test Drive" && "🔵 Test Drive"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top text-center" style={{ borderColor: "var(--border-color) !important" }}>
                <span className="text-muted small">Showroom Floor Capacity: 12 Parties</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Walk-In Registration Modal */}
      {showWalkinModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowWalkinModal(false)}>
          <div className="modal-dialog-custom modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5 className="modal-title-custom">
                <i className="bi bi-person-plus-fill text-primary"></i> Register New Showroom Walk-In
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowWalkinModal(false)}
              ></button>
            </div>

            <form onSubmit={handleRegisterWalkin}>
              <div className="modal-body-custom">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">Visitor Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ramesh Chandra"
                      required
                      value={newWalkin.name}
                      onChange={(e) => setNewWalkin({ ...newWalkin, name: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 98765 43210"
                      required
                      value={newWalkin.phone}
                      onChange={(e) => setNewWalkin({ ...newWalkin, phone: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">Interested Vehicle / Model</label>
                    <select
                      className="form-select"
                      value={newWalkin.vehicle}
                      onChange={(e) => setNewWalkin({ ...newWalkin, vehicle: e.target.value })}
                    >
                      <option value="Maruti Suzuki Grand Vitara">Maruti Suzuki Grand Vitara</option>
                      <option value="Tata Safari Adventure Plus">Tata Safari Adventure Plus</option>
                      <option value="Mahindra Thar Roxx AX7L">Mahindra Thar Roxx AX7L</option>
                      <option value="Hyundai Creta SX (O) Turbo">Hyundai Creta SX (O) Turbo</option>
                      <option value="Royal Enfield Classic 350">Royal Enfield Classic 350</option>
                      <option value="Honda Activa 6G / H-Smart">Honda Activa 6G / H-Smart</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">Assign Available Sales Rep</label>
                    <select
                      className="form-select"
                      value={newWalkin.assignedRep}
                      onChange={(e) => setNewWalkin({ ...newWalkin, assignedRep: e.target.value })}
                    >
                      <option value="Rahul Verma">Rahul Verma (🟢 Free on Floor)</option>
                      <option value="Sneha Joshi">Sneha Joshi (🟢 Free on Floor)</option>
                      <option value="Vikram Singh">Vikram Singh (🟠 In Pod 1)</option>
                      <option value="David Miller">David Miller (🔵 On Test Drive)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={() => setShowWalkinModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-ticket-perforated-fill me-1"></i> Generate Token & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
