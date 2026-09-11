"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/app/components/AdminLayout";
import { useToast } from "@/app/components/Toast";

export default function DashboardPage() {
  const { showToast } = useToast();
  const [chartPeriod, setChartPeriod] = useState("6m");
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // New Lead Form state
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    brand: "Maruti Suzuki",
    model: "Grand Vitara",
    budget: "$24,500",
    priority: "Hot",
    source: "Website",
  });

  const handleAddLeadSubmit = (e) => {
    e.preventDefault();
    showToast(
      `New Lead created for ${newLead.name} (${newLead.brand} ${newLead.model}) with ${newLead.priority} priority!`,
      "success"
    );
    setShowAddLeadModal(false);
    setNewLead({
      name: "",
      phone: "",
      brand: "Maruti Suzuki",
      model: "Grand Vitara",
      budget: "$24,500",
      priority: "Hot",
      source: "Website",
    });
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
              <li className="breadcrumb-item active">Dashboard</li>
            </ul>
            <h1 className="page-title mt-1">Dealership Executive Dashboard</h1>
          </div>

          <div className="page-header-actions d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-custom"
              onClick={() => showToast("Exporting executive summary report as CSV...", "info")}
            >
              <i className="bi bi-file-earmark-arrow-down"></i>
              <span>Export CSV</span>
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddLeadModal(true)}>
              <i className="bi bi-plus-circle"></i>
              <span>Add New Lead</span>
            </button>
          </div>
        </div>

        {/* 4 Key Metric KPI Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Total Inquiries</span>
                <div className="stat-icon-box primary">
                  <i className="bi bi-funnel-fill"></i>
                </div>
              </div>
              <div className="stat-card-value">1,284</div>
              <div className="stat-change positive">
                <i className="bi bi-arrow-up-short"></i>
                <span>+14.8% vs last month</span>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Follow-Ups Due</span>
                <div className="stat-icon-box warning">
                  <i className="bi bi-telephone-outbound-fill"></i>
                </div>
              </div>
              <div className="stat-card-value">48 Calls</div>
              <div className="stat-change text-warning">
                <i className="bi bi-clock-history"></i>
                <span>12 urgent overdue</span>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Test Drives Booked</span>
                <div className="stat-icon-box info">
                  <i className="bi bi-car-front-fill"></i>
                </div>
              </div>
              <div className="stat-card-value">132</div>
              <div className="stat-change positive">
                <i className="bi bi-arrow-up-short"></i>
                <span>+22 scheduled this week</span>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Deals Closed</span>
                <div className="stat-icon-box success">
                  <i className="bi bi-trophy-fill"></i>
                </div>
              </div>
              <div className="stat-card-value">64 Units</div>
              <div className="stat-change positive">
                <i className="bi bi-currency-rupee"></i>
                <span>₹8.42 Cr total volume</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Charts Row */}
        <div className="row g-4 mb-4">
          {/* Monthly Inquiries vs Deals Chart Simulation */}
          <div className="col-xl-8">
            <div className="card h-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="card-title mb-1">Dealership Monthly Performance</h5>
                  <p className="text-muted small mb-0">Total vehicle inquiries compared with final closed bookings</p>
                </div>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className={`btn ${chartPeriod === "6m" ? "btn-primary" : "btn-outline-custom"}`}
                    onClick={() => setChartPeriod("6m")}
                  >
                    6 Months
                  </button>
                  <button
                    type="button"
                    className={`btn ${chartPeriod === "1y" ? "btn-primary" : "btn-outline-custom"}`}
                    onClick={() => setChartPeriod("1y")}
                  >
                    1 Year
                  </button>
                </div>
              </div>

              <div className="card-body">
                {/* Visual Bar/Line Representation */}
                <div style={{ height: "260px", display: "flex", alignItems: "flex-end", gap: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border-color)" }}>
                  {(chartPeriod === "6m"
                    ? [
                        { m: "Mar", inq: 65, deals: 12 },
                        { m: "Apr", inq: 80, deals: 19 },
                        { m: "May", inq: 95, deals: 15 },
                        { m: "Jun", inq: 120, deals: 24 },
                        { m: "Jul", inq: 110, deals: 22 },
                        { m: "Aug", inq: 145, deals: 29 },
                      ]
                    : [
                        { m: "Sep", inq: 45, deals: 8 },
                        { m: "Oct", inq: 55, deals: 11 },
                        { m: "Nov", inq: 60, deals: 14 },
                        { m: "Dec", inq: 72, deals: 16 },
                        { m: "Jan", inq: 58, deals: 12 },
                        { m: "Feb", inq: 62, deals: 14 },
                        { m: "Mar", inq: 65, deals: 12 },
                        { m: "Apr", inq: 80, deals: 19 },
                        { m: "May", inq: 95, deals: 15 },
                        { m: "Jun", inq: 120, deals: 24 },
                        { m: "Jul", inq: 110, deals: 22 },
                        { m: "Aug", inq: 145, deals: 29 },
                      ]
                  ).map((item, idx) => (
                    <div key={idx} className="flex-grow-1 text-center" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                      <div className="d-flex align-items-flex-end gap-1" style={{ height: "80%", alignItems: "flex-end", width: "100%", justifyContent: "center" }}>
                        {/* Inquiries Bar */}
                        <div
                          style={{
                            height: `${(item.inq / 160) * 100}%`,
                            width: "16px",
                            background: "rgba(63, 73, 18, 0.75)",
                            borderRadius: "4px 4px 0 0",
                            transition: "height 0.3s ease",
                          }}
                          title={`Inquiries: ${item.inq}`}
                        ></div>
                        {/* Deals Bar */}
                        <div
                          style={{
                            height: `${(item.deals / 35) * 100}%`,
                            width: "14px",
                            background: "#EE6800",
                            borderRadius: "4px 4px 0 0",
                            transition: "height 0.3s ease",
                          }}
                          title={`Deals Closed: ${item.deals}`}
                        ></div>
                      </div>
                      <span className="text-muted small mt-2" style={{ fontSize: "0.75rem" }}>
                        {item.m}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chart Legend */}
                <div className="d-flex justify-content-center gap-4 mt-3">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ width: "14px", height: "14px", background: "rgba(63, 73, 18, 0.75)", borderRadius: "3px" }}></span>
                    <span className="text-muted small">Total Inquiries</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ width: "14px", height: "14px", background: "#EE6800", borderRadius: "3px" }}></span>
                    <span className="text-muted small">Deals Closed (Units)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Status Breakdown Donut Card */}
          <div className="col-xl-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title mb-1">Pipeline Stage Distribution</h5>
                <p className="text-muted small mb-0">Active leads categorized by current stage</p>
              </div>

              <div className="card-body d-flex flex-column justify-content-between">
                <div className="py-2 text-center">
                  <div
                    style={{
                      width: "160px",
                      height: "160px",
                      borderRadius: "50%",
                      background: "conic-gradient(#3F4912 0% 28%, #EE6800 28% 63%, #D99A00 63% 85%, #008318 85% 100%)",
                      margin: "0 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "110px",
                        height: "110px",
                        borderRadius: "50%",
                        background: "#202224",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span className="text-white fw-bold fs-4">100%</span>
                      <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                        Pipeline
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row g-2 mt-3">
                  <div className="col-6">
                    <div className="p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ width: "10px", height: "10px", background: "#3F4912", borderRadius: "50%" }}></span>
                        <span className="text-white small fw-bold">New Lead</span>
                      </div>
                      <div className="fs-6 fw-bold text-white mt-1">28% (360)</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ width: "10px", height: "10px", background: "#EE6800", borderRadius: "50%" }}></span>
                        <span className="text-white small fw-bold">Contacted</span>
                      </div>
                      <div className="fs-6 fw-bold text-white mt-1">35% (450)</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ width: "10px", height: "10px", background: "#D99A00", borderRadius: "50%" }}></span>
                        <span className="text-white small fw-bold">Qualified / TD</span>
                      </div>
                      <div className="fs-6 fw-bold text-white mt-1">22% (282)</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ width: "10px", height: "10px", background: "#008318", borderRadius: "50%" }}></span>
                        <span className="text-white small fw-bold">Won / Booked</span>
                      </div>
                      <div className="fs-6 fw-bold text-white mt-1">15% (192)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Inquiries Table & Top Sales Consultants */}
        <div className="row g-4">
          {/* Recent Inquiries Table */}
          <div className="col-xl-8">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-0">Recent Inquiries & Prospects</h5>
                  <span className="text-muted small">Live customer pipeline entries</span>
                </div>
                <Link href="/leads" className="btn btn-sm btn-outline-custom">
                  <span>View All Leads</span>
                  <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Interested Vehicle</th>
                      <th>Priority</th>
                      <th>Assigned Rep</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src="/image/avatar-1.svg" alt="Rajesh" className="avatar" style={{ width: "32px", height: "32px" }} />
                          <div>
                            <div className="text-white fw-bold small">Rajesh Verma</div>
                            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                              +91 98231 44520
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white fw-semibold small">Tata Safari Adventure Plus</span>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Diesel AT • Dark Edition
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-danger-subtle text-danger px-2 py-1 rounded-pill small">
                          <i className="bi bi-fire me-1"></i>Hot
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary small">Vikram Singh</span>
                      </td>
                      <td>
                        <span className="badge-custom badge-active">
                          <span className="badge-dot-indicator"></span>New Inquiry
                        </span>
                      </td>
                      <td className="text-end">
                        <Link href="/leads" className="btn btn-xs btn-outline-custom">
                          <i className="bi bi-eye"></i>
                        </Link>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src="/image/avatar-2.svg" alt="Priya" className="avatar" style={{ width: "32px", height: "32px" }} />
                          <div>
                            <div className="text-white fw-bold small">Priya Menon</div>
                            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                              +91 97410 88231
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white fw-semibold small">Hyundai Creta SX (O) Turbo</span>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Petrol 7-Speed DCT
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-warning-subtle text-warning px-2 py-1 rounded-pill small">
                          <i className="bi bi-sun-fill me-1"></i>Warm
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary small">Ananya Roy</span>
                      </td>
                      <td>
                        <span className="badge-custom badge-pending">
                          <span className="badge-dot-indicator"></span>Contacted
                        </span>
                      </td>
                      <td className="text-end">
                        <Link href="/leads" className="btn btn-xs btn-outline-custom">
                          <i className="bi bi-eye"></i>
                        </Link>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src="/image/avatar-3.svg" alt="Amit" className="avatar" style={{ width: "32px", height: "32px" }} />
                          <div>
                            <div className="text-white fw-bold small">Amit Patel</div>
                            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                              +91 99012 34567
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white fw-semibold small">Mahindra Thar Roxx AX7L 4x4</span>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Diesel AT • Stealth Black
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-danger-subtle text-danger px-2 py-1 rounded-pill small">
                          <i className="bi bi-fire me-1"></i>Hot
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary small">Vikram Singh</span>
                      </td>
                      <td>
                        <span className="badge-custom badge-completed">
                          <span className="badge-dot-indicator"></span>TD Scheduled
                        </span>
                      </td>
                      <td className="text-end">
                        <Link href="/leads" className="btn btn-xs btn-outline-custom">
                          <i className="bi bi-eye"></i>
                        </Link>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src="/image/avatar-4.svg" alt="Sunita" className="avatar" style={{ width: "32px", height: "32px" }} />
                          <div>
                            <div className="text-white fw-bold small">Sunita Rao</div>
                            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                              +91 98860 11223
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white fw-semibold small">Maruti Grand Vitara Alpha Hybrid</span>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          e-CVT Strong Hybrid
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-warning-subtle text-warning px-2 py-1 rounded-pill small">
                          <i className="bi bi-sun-fill me-1"></i>Warm
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary small">Rohan Mehta</span>
                      </td>
                      <td>
                        <span className="badge-custom badge-active">
                          <span className="badge-dot-indicator"></span>Quotation Sent
                        </span>
                      </td>
                      <td className="text-end">
                        <Link href="/leads" className="btn btn-xs btn-outline-custom">
                          <i className="bi bi-eye"></i>
                        </Link>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src="/image/avatar-5.svg" alt="Karthik" className="avatar" style={{ width: "32px", height: "32px" }} />
                          <div>
                            <div className="text-white fw-bold small">Karthik Iyer</div>
                            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                              +91 94480 55678
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white fw-semibold small">Royal Enfield Classic 350 Stealth</span>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          2-Wheeler • Dual Channel ABS
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info-subtle text-info px-2 py-1 rounded-pill small">
                          <i className="bi bi-snow me-1"></i>Cold
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary small">Ananya Roy</span>
                      </td>
                      <td>
                        <span className="badge-custom badge-pending">
                          <span className="badge-dot-indicator"></span>Follow Up
                        </span>
                      </td>
                      <td className="text-end">
                        <Link href="/leads" className="btn btn-xs btn-outline-custom">
                          <i className="bi bi-eye"></i>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Performing Sales Consultants */}
          <div className="col-xl-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Top Sales Executives</h5>
                <span className="badge bg-success-subtle text-success rounded-pill">This Month</span>
              </div>

              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <img src="/image/avatar-1.svg" alt="Vikram" className="avatar" />
                      <div>
                        <div className="text-white fw-bold small">Vikram Singh</div>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Senior Sales Consultant
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-warning fw-bold small">24 Deals</div>
                      <span className="text-success" style={{ fontSize: "0.75rem" }}>
                        94% Target
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <img src="/image/avatar-2.svg" alt="Ananya" className="avatar" />
                      <div>
                        <div className="text-white fw-bold small">Ananya Roy</div>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Automotive Advisor
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-warning fw-bold small">19 Deals</div>
                      <span className="text-success" style={{ fontSize: "0.75rem" }}>
                        88% Target
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <img src="/image/avatar-3.svg" alt="Rohan" className="avatar" />
                      <div>
                        <div className="text-white fw-bold small">Rohan Mehta</div>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Sales Executive (2W/4W)
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-warning fw-bold small">15 Deals</div>
                      <span className="text-success" style={{ fontSize: "0.75rem" }}>
                        82% Target
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <img src="/image/avatar-4.svg" alt="Sneha" className="avatar" />
                      <div>
                        <div className="text-white fw-bold small">Sneha Joshi</div>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Relationship Manager
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-warning fw-bold small">12 Deals</div>
                      <span className="text-success" style={{ fontSize: "0.75rem" }}>
                        75% Target
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center" style={{ borderColor: "var(--border-color) !important" }}>
                  <span className="text-muted small">Need team reallocation?</span>
                  <Link href="/users" className="btn btn-xs btn-primary">
                    Manage Team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Lead Modal */}
        {showAddLeadModal && (
          <div className="modal-backdrop-custom" onClick={() => setShowAddLeadModal(false)}>
            <div className="modal-dialog-custom modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-custom">
                <h5 className="modal-title-custom">
                  <i className="bi bi-person-plus-fill text-primary"></i> Add New Lead & Inquiry
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddLeadModal(false)}
                ></button>
              </div>

              <form onSubmit={handleAddLeadSubmit}>
                <div className="modal-body-custom">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-white fw-semibold small">Customer Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Vikram Sharma"
                        required
                        value={newLead.name}
                        onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-white fw-semibold small">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+91 98765 43210"
                        required
                        value={newLead.phone}
                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-white fw-semibold small">Brand</label>
                      <select
                        className="form-select"
                        value={newLead.brand}
                        onChange={(e) => setNewLead({ ...newLead, brand: e.target.value })}
                      >
                        <option value="Maruti Suzuki">Maruti Suzuki</option>
                        <option value="Tata Motors">Tata Motors</option>
                        <option value="Mahindra">Mahindra</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Royal Enfield">Royal Enfield</option>
                        <option value="Honda">Honda</option>
                        <option value="TVS">TVS</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-white fw-semibold small">Model & Variant</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Grand Vitara Alpha Hybrid"
                        value={newLead.model}
                        onChange={(e) => setNewLead({ ...newLead, model: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-white fw-semibold small">Estimated Budget</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="₹20 - 25 Lakhs"
                        value={newLead.budget}
                        onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-white fw-semibold small">Lead Source</label>
                      <select
                        className="form-select"
                        value={newLead.source}
                        onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                      >
                        <option value="Website">Website Inquiry</option>
                        <option value="Walk-in">Showroom Walk-in</option>
                        <option value="Meta Ads">Facebook / Instagram Ads</option>
                        <option value="Google Ads">Google Ads</option>
                        <option value="Referral">Customer Referral</option>
                        <option value="CarDekho">CarDekho / CarWale</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label text-white fw-semibold small">Priority Level</label>
                      <div className="d-flex gap-4">
                        {["Hot", "Warm", "Cold"].map((p) => (
                          <div className="form-check" key={p}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="leadPriority"
                              id={`dash-p-${p}`}
                              checked={newLead.priority === p}
                              onChange={() => setNewLead({ ...newLead, priority: p })}
                            />
                            <label className="form-check-label text-white small" htmlFor={`dash-p-${p}`}>
                              {p === "Hot" && <i className="bi bi-fire text-danger me-1"></i>}
                              {p === "Warm" && <i className="bi bi-sun-fill text-warning me-1"></i>}
                              {p === "Cold" && <i className="bi bi-snow text-info me-1"></i>}
                              {p} Priority
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer-custom">
                  <button
                    type="button"
                    className="btn btn-outline-custom"
                    onClick={() => setShowAddLeadModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-1"></i> Create Lead
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
