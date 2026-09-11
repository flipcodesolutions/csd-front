"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ToastProvider, useToast } from "./Toast";

function SalesExecutiveLayoutInner({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      const userStr = localStorage.getItem("user");
      if (!token) {
        router.push("/login");
        return;
      }
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
    showToast("Logged out successfully.", "info");
    setTimeout(() => {
      router.push("/login");
    }, 300);
  };

  return (
    <div className="se-portal-root" style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#f1f5f9" }}>
      {/* Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark border-bottom border-secondary border-opacity-25 px-3 px-md-4 py-2" style={{ backgroundColor: "#111827", backdropFilter: "blur(12px)" }}>
        <div className="container-fluid px-0 d-flex align-items-center justify-content-between">
          {/* Brand Logo & Title */}
          <Link href="/sales-executive/leads" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)" }}>
              <i className="bi bi-shield-check text-white fs-5"></i>
            </div>
            <div className="d-flex flex-column">
              <span className="fw-bold text-white fs-6 lh-sm">Defence Autolink</span>
              <span className="text-primary small fw-semibold" style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}>
                SALES EXECUTIVE PORTAL
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="d-none d-md-flex align-items-center gap-3">
            <Link
              href="/sales-executive/leads"
              className={`btn btn-sm px-3 rounded-pill fw-medium ${
                pathname?.startsWith("/sales-executive/leads")
                  ? "btn-primary shadow-sm"
                  : "btn-outline-secondary text-light border-0"
              }`}
            >
              <i className="bi bi-person-lines-fill me-1"></i>
              My Assigned Leads
            </Link>
          </div>

          {/* Right User Card & Logout */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2 bg-dark bg-opacity-50 px-3 py-1 rounded-pill border border-secondary border-opacity-25">
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  color: "#fff",
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="d-none d-sm-block text-start">
                <div className="fw-bold text-white small lh-1">{currentUser?.name || "Sales Executive"}</div>
                <div className="text-success" style={{ fontSize: "0.68rem" }}>
                  ● Active
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
              onClick={handleLogout}
              title="Sign Out"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span className="d-none d-sm-inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container-fluid px-3 px-md-4 py-4">{children}</main>
    </div>
  );
}

export default function SalesExecutiveLayout({ children }) {
  return (
    <ToastProvider>
      <SalesExecutiveLayoutInner>{children}</SalesExecutiveLayoutInner>
    </ToastProvider>
  );
}
