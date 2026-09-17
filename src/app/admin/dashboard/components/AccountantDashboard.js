"use client";

import React, { useState } from "react";
import { useToast } from "@/app/components/Toast";

export default function AccountantDashboard() {
  const { showToast } = useToast();

  // State for interactive payment receipts
  const [payments, setPayments] = useState([
    {
      id: "REC-8840",
      customer: "Kunal Singhania",
      vehicle: "Mahindra Thar Roxx AX7L 4x4",
      mode: "NEFT / RTGS (HDFC)",
      txnRef: "HDFCN982103491",
      amount: "₹5,00,000",
      type: "Booking Down Payment",
      date: "Today, 10:30 AM",
      status: "Pending Verification",
    },
    {
      id: "REC-8841",
      customer: "Dr. Arvind Saxena",
      vehicle: "Maruti Grand Vitara Alpha Hybrid",
      mode: "UPI Corporate (SBI)",
      txnRef: "UPI/3891048201/AXIS",
      amount: "₹51,000",
      type: "Token Advance Booking",
      date: "Today, 11:15 AM",
      status: "Pending Verification",
    },
    {
      id: "REC-8842",
      customer: "Priya Menon",
      vehicle: "Hyundai Creta SX (O) Turbo",
      mode: "Bank Cheque (ICICI)",
      txnRef: "CHQ #449102",
      amount: "₹3,50,000",
      type: "Part Payment Settlement",
      date: "Yesterday, 04:00 PM",
      status: "Verified & Cleared",
    },
    {
      id: "REC-8843",
      customer: "Captain Vikram Rathore",
      vehicle: "Royal Enfield Classic 350",
      mode: "Debit Card Swipe (Showroom POS)",
      txnRef: "POS-TXN-88219",
      amount: "₹1,20,000",
      type: "Full Balance Payment",
      date: "Yesterday, 02:30 PM",
      status: "Verified & Cleared",
    },
  ]);

  // State for Bank Finance / Loan tracker
  const [loanApplications, setLoanApplications] = useState([
    {
      appNo: "LOAN-SBI-201",
      customer: "Rajesh Verma",
      bank: "State Bank of India (SBI)",
      amount: "₹18,50,000",
      roi: "8.75% p.a.",
      status: "Sanction Letter Issued",
      badge: "success",
    },
    {
      appNo: "LOAN-HDFC-202",
      customer: "Dr. Meenakshi Sundaram",
      bank: "HDFC Bank Car Finance",
      amount: "₹20,00,000",
      roi: "8.60% p.a.",
      status: "Doc Verification In-Progress",
      badge: "warning",
    },
    {
      appNo: "LOAN-ICICI-203",
      customer: "Amit Patel",
      bank: "ICICI Bank Auto Loan",
      amount: "₹16,00,000",
      roi: "8.85% p.a.",
      status: "Disbursement Awaiting Invoice",
      badge: "info",
    },
  ]);

  const handleVerifyPayment = (recId, customer, amount) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === recId ? { ...p, status: "Verified & Cleared" } : p))
    );
    showToast(`Payment receipt ${recId} of ${amount} for ${customer} has been verified and cleared!`, "success");
  };

  return (
    <div>
      {/* 4 Financial KPI Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Monthly Collections</span>
              <div className="stat-icon-box success">
                <i className="bi bi-currency-rupee"></i>
              </div>
            </div>
            <div className="stat-card-value">₹3.82 Cr</div>
            <div className="stat-change positive">
              <i className="bi bi-arrow-up-short"></i>
              <span>+24.5% vs last month inflow</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Pending Verifications</span>
              <div className="stat-icon-box warning">
                <i className="bi bi-receipt-cutoff"></i>
              </div>
            </div>
            <div className="stat-card-value text-warning">
              {payments.filter((p) => p.status === "Pending Verification").length} Receipts
            </div>
            <div className="stat-change text-warning">
              <i className="bi bi-clock"></i>
              <span>₹5.51 Lakhs awaiting clearing</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Active Loan Files</span>
              <div className="stat-icon-box info">
                <i className="bi bi-bank2"></i>
              </div>
            </div>
            <div className="stat-card-value">14 Cases</div>
            <div className="stat-change positive">
              <i className="bi bi-check2-circle"></i>
              <span>₹2.45 Cr in sanction pipeline</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Tax Invoices Cleared</span>
              <div className="stat-icon-box primary">
                <i className="bi bi-file-earmark-check-fill"></i>
              </div>
            </div>
            <div className="stat-card-value">42 GST Invoices</div>
            <div className="stat-change positive">
              <i className="bi bi-shield-check"></i>
              <span>100% Tax compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Receipts Verification Queue & Bank Loan Approvals */}
      <div className="row g-4 mb-4">
        {/* Payment Receipts Verification Table */}
        <div className="col-xl-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0">Payment Collections & Receipt Verification</h5>
                <span className="text-muted small">Verify booking advances, down payments, and RTGS clearance</span>
              </div>
              <span className="badge bg-warning-subtle text-warning">
                {payments.filter((p) => p.status === "Pending Verification").length} Pending
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Receipt # & Customer</th>
                    <th>Vehicle & Type</th>
                    <th>Payment Mode & Txn ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-end">Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="text-white fw-bold small">{p.customer}</div>
                        <span className="text-muted font-monospace" style={{ fontSize: "0.75rem" }}>
                          {p.id} • {p.date}
                        </span>
                      </td>
                      <td>
                        <span className="text-white small fw-semibold">{p.vehicle}</span>
                        <div className="text-info small">{p.type}</div>
                      </td>
                      <td>
                        <span className="text-white small">{p.mode}</span>
                        <div className="text-muted font-monospace" style={{ fontSize: "0.72rem" }}>
                          {p.txnRef}
                        </div>
                      </td>
                      <td>
                        <span className="text-success fw-bold">{p.amount}</span>
                      </td>
                      <td>
                        {p.status === "Pending Verification" ? (
                          <span className="badge bg-warning-subtle text-warning">Awaiting Clearance</span>
                        ) : (
                          <span className="badge bg-success-subtle text-success">
                            <i className="bi bi-check-circle me-1"></i>Cleared & Issued
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        {p.status === "Pending Verification" ? (
                          <button
                            type="button"
                            className="btn btn-xs btn-success d-inline-flex align-items-center gap-1"
                            onClick={() => handleVerifyPayment(p.id, p.customer, p.amount)}
                          >
                            <i className="bi bi-check-lg"></i>
                            <span>Verify & Issue</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-xs btn-outline-custom d-inline-flex align-items-center gap-1"
                            onClick={() => showToast(`Downloading official money receipt for ${p.id}...`, "info")}
                          >
                            <i className="bi bi-file-earmark-pdf"></i>
                            <span>PDF Receipt</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bank Loan Finance Sanctions Tracker */}
        <div className="col-xl-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Bank Loan Clearance</h5>
              <span className="badge bg-primary-subtle text-white">Finance Desk</span>
            </div>

            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                {loanApplications.map((loan, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-3 d-flex flex-column gap-1"
                    style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold small" style={{ color: "var(--text-primary)" }}>{loan.customer}</div>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          {loan.appNo}
                        </span>
                      </div>
                      <span className="text-warning fw-bold small">{loan.amount}</span>
                    </div>

                    <div className="text-primary small mt-1">{loan.bank} • {loan.roi}</div>

                    <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ borderColor: "var(--border-color)" }}>
                      <span className={`badge bg-${loan.badge}-subtle text-${loan.badge} rounded-pill`}>
                        {loan.status}
                      </span>
                      <button
                        type="button"
                        className="btn btn-xs btn-outline-custom"
                        onClick={() => showToast(`Opening Bank Disbursement file for ${loan.appNo}...`, "info")}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top" style={{ borderColor: "var(--border-color) !important" }}>
                <div className="d-flex justify-content-between align-items-center text-muted small">
                  <span>Tie-up Banks: SBI, HDFC, ICICI, Axis</span>
                  <span className="text-success fw-bold">Avg ROI: 8.65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Quotation Audit & Margin Verification */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title mb-0">Commercial Quotation Billing Breakdown</h5>
            <span className="text-muted small">Automated tax, TCS, RTO registration, and dealership margin validation</span>
          </div>
          <span className="badge bg-success-subtle text-success">GST Ready</span>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3 col-sm-6">
              <div className="p-3 rounded-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                <span className="text-muted small">Gross Ex-Showroom Invoiced</span>
                <div className="fw-bold fs-5 mt-1" style={{ color: "var(--text-primary)" }}>₹3.14 Cr</div>
                <span className="text-success small">42 Vehicles</span>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-3 rounded-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                <span className="text-muted small">RTO Road Tax Remitted</span>
                <div className="fw-bold fs-5 mt-1" style={{ color: "var(--text-primary)" }}>₹41.8 Lakhs</div>
                <span className="text-primary small">Challans Verified</span>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-3 rounded-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                <span className="text-muted small">GST (28% + Cess) Output</span>
                <div className="fw-bold fs-5 mt-1" style={{ color: "var(--text-primary)" }}>₹88.2 Lakhs</div>
                <span className="text-warning small">Tax Invoice Input Synced</span>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-3 rounded-3" style={{ background: "#F7F7F5", border: "1px solid var(--border-color)" }}>
                <span className="text-muted small">Dealership Gross Margin</span>
                <div className="fw-bold fs-5 mt-1" style={{ color: "var(--text-primary)" }}>₹26.4 Lakhs</div>
                <span className="text-success small">8.4% Average Margin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
