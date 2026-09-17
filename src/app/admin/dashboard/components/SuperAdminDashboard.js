"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/app/components/Toast";

export default function SuperAdminDashboard({ onAddLead }) {
  const { showToast } = useToast();
  const [chartPeriod, setChartPeriod] = useState("6m");

  return (
    <div>
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
            <div className="stat-card-value">1,480</div>
            <div className="stat-change positive">
              <i className="bi bi-arrow-up-short"></i>
              <span>+18.4% vs last month</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Gross Dealership Volume</span>
              <div className="stat-icon-box success">
                <i className="bi bi-currency-rupee"></i>
              </div>
            </div>
            <div className="stat-card-value">₹12.45 Cr</div>
            <div className="stat-change positive">
              <i className="bi bi-trophy-fill"></i>
              <span>64 Units delivered</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Pipeline Conversion</span>
              <div className="stat-icon-box info">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
            </div>
            <div className="stat-card-value">32.4%</div>
            <div className="stat-change positive">
              <i className="bi bi-arrow-up-short"></i>
              <span>+4.2% industry benchmark</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Active Team / Staff</span>
              <div className="stat-icon-box warning">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
            <div className="stat-card-value">38 Users</div>
            <div className="stat-change text-warning">
              <i className="bi bi-shield-check"></i>
              <span>5 Active Roles configured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="row g-4 mb-4">
        {/* Monthly Inquiries vs Deals Chart */}
        <div className="col-xl-8">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title mb-1">Dealership Monthly Performance & Velocity</h5>
                <p className="text-muted small mb-0">Total vehicle inquiries compared with final closed bookings across all brands</p>
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
              <div style={{ height: "260px", display: "flex", alignItems: "flex-end", gap: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border-color)" }}>
                {(chartPeriod === "6m"
                  ? [
                      { m: "Mar", inq: 75, deals: 16 },
                      { m: "Apr", inq: 90, deals: 21 },
                      { m: "May", inq: 105, deals: 18 },
                      { m: "Jun", inq: 130, deals: 26 },
                      { m: "Jul", inq: 120, deals: 24 },
                      { m: "Aug", inq: 155, deals: 32 },
                    ]
                  : [
                      { m: "Sep", inq: 45, deals: 8 },
                      { m: "Oct", inq: 55, deals: 11 },
                      { m: "Nov", inq: 60, deals: 14 },
                      { m: "Dec", inq: 72, deals: 16 },
                      { m: "Jan", inq: 58, deals: 12 },
                      { m: "Feb", inq: 62, deals: 14 },
                      { m: "Mar", inq: 75, deals: 16 },
                      { m: "Apr", inq: 90, deals: 21 },
                      { m: "May", inq: 105, deals: 18 },
                      { m: "Jun", inq: 130, deals: 26 },
                      { m: "Jul", inq: 120, deals: 24 },
                      { m: "Aug", inq: 155, deals: 32 },
                    ]
                ).map((item, idx) => (
                  <div key={idx} className="flex-grow-1 text-center" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                    <div className="d-flex align-items-flex-end gap-1" style={{ height: "80%", alignItems: "flex-end", width: "100%", justifyContent: "center" }}>
                      {/* Inquiries Bar */}
                      <div
                        style={{
                          height: `${(item.inq / 170) * 100}%`,
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
                          height: `${(item.deals / 40) * 100}%`,
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
              <p className="text-muted small mb-0">Active leads categorized across Dealership stages</p>
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
                    <span className="text-white fw-bold fs-4">1,480</span>
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                      Total Leads
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
                    <div className="fs-6 fw-bold text-white mt-1">28% (414)</div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: "10px", height: "10px", background: "#EE6800", borderRadius: "50%" }}></span>
                      <span className="text-white small fw-bold">Contacted</span>
                    </div>
                    <div className="fs-6 fw-bold text-white mt-1">35% (518)</div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: "10px", height: "10px", background: "#D99A00", borderRadius: "50%" }}></span>
                      <span className="text-white small fw-bold">Qualified / TD</span>
                    </div>
                    <div className="fs-6 fw-bold text-white mt-1">22% (325)</div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: "10px", height: "10px", background: "#008318", borderRadius: "50%" }}></span>
                      <span className="text-white small fw-bold">Won / Booked</span>
                    </div>
                    <div className="fs-6 fw-bold text-white mt-1">15% (223)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Master Data Quick Launch Grid */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title mb-0">System Master Control & Catalogs</h5>
            <span className="text-muted small">Instant management links for Super Admin</span>
          </div>
          <span className="badge bg-primary-subtle text-white">Master Modules</span>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3 col-sm-6">
              <Link href="/admin/users" className="text-decoration-none">
                <div className="p-3 rounded-3 text-center transition-all" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                  <i className="bi bi-people-fill text-primary fs-3 mb-2 d-block"></i>
                  <div className="text-white fw-bold">Users & Roles</div>
                  <div className="text-muted small">Manage 5 User Roles</div>
                </div>
              </Link>
            </div>
            <div className="col-md-3 col-sm-6">
              <Link href="/admin/brand" className="text-decoration-none">
                <div className="p-3 rounded-3 text-center transition-all" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                  <i className="bi bi-shield-shaded text-warning fs-3 mb-2 d-block"></i>
                  <div className="text-white fw-bold">Brands & OEM</div>
                  <div className="text-muted small">Maruti, Tata, RE, etc.</div>
                </div>
              </Link>
            </div>
            <div className="col-md-3 col-sm-6">
              <Link href="/admin/model" className="text-decoration-none">
                <div className="p-3 rounded-3 text-center transition-all" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                  <i className="bi bi-car-front-fill text-success fs-3 mb-2 d-block"></i>
                  <div className="text-white fw-bold">Models & Variants</div>
                  <div className="text-muted small">2W & 4W Vehicles</div>
                </div>
              </Link>
            </div>
            <div className="col-md-3 col-sm-6">
              <Link href="/admin/settings" className="text-decoration-none">
                <div className="p-3 rounded-3 text-center transition-all" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                  <i className="bi bi-gear-fill text-info fs-3 mb-2 d-block"></i>
                  <div className="text-white fw-bold">Security & System</div>
                  <div className="text-muted small">Global Permissions</div>
                </div>
              </Link>
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
                <h5 className="card-title mb-0">Global Inquiries Pipeline</h5>
                <span className="text-muted small">Live customer pipeline entries across all departments</span>
              </div>
              <Link href="/admin/leads" className="btn btn-sm btn-outline-custom">
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
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff", fontSize: "0.85rem" }}>
                          R
                        </div>
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
                      <Link href="/admin/leads" className="btn btn-xs btn-outline-custom">
                        <i className="bi bi-eye"></i>
                      </Link>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff", fontSize: "0.85rem" }}>
                          P
                        </div>
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
                      <span className="text-secondary small">Rahul Verma</span>
                    </td>
                    <td>
                      <span className="badge-custom badge-pending">
                        <span className="badge-dot-indicator"></span>Contacted
                      </span>
                    </td>
                    <td className="text-end">
                      <Link href="/admin/leads" className="btn btn-xs btn-outline-custom">
                        <i className="bi bi-eye"></i>
                      </Link>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff", fontSize: "0.85rem" }}>
                          A
                        </div>
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
                      <span className="text-secondary small">David Miller</span>
                    </td>
                    <td>
                      <span className="badge-custom badge-completed">
                        <span className="badge-dot-indicator"></span>TD Scheduled
                      </span>
                    </td>
                    <td className="text-end">
                      <Link href="/admin/leads" className="btn btn-xs btn-outline-custom">
                        <i className="bi bi-eye"></i>
                      </Link>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff", fontSize: "0.85rem" }}>
                          S
                        </div>
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
                      <span className="text-secondary small">Rahul Verma</span>
                    </td>
                    <td>
                      <span className="badge-custom badge-active">
                        <span className="badge-dot-indicator"></span>Quotation Sent
                      </span>
                    </td>
                    <td className="text-end">
                      <Link href="/admin/leads" className="btn btn-xs btn-outline-custom">
                        <i className="bi bi-eye"></i>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Performing Sales Reps */}
        <div className="col-xl-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Top Performing Reps</h5>
              <span className="badge bg-success-subtle text-success rounded-pill">This Month</span>
            </div>

            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "#181a1b", border: "1px solid var(--border-color)" }}>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff" }}>
                      V
                    </div>
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
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff" }}>
                      R
                    </div>
                    <div>
                      <div className="text-white fw-bold small">Rahul Verma</div>
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Sales Executive
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
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff" }}>
                      D
                    </div>
                    <div>
                      <div className="text-white fw-bold small">David Miller</div>
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
              </div>

              <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center" style={{ borderColor: "var(--border-color) !important" }}>
                <span className="text-muted small">Need team reallocation?</span>
                <Link href="/admin/users" className="btn btn-xs btn-primary">
                  Manage Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
