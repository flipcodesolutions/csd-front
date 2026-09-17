"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "./Toast";

export default function Sidebar({ isOpen, isCollapsed, onCloseMobile }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const isLinkActive = (path) => {
    if (
      path === "/admin/dashboard" &&
      (pathname === "/" ||
        pathname === "/admin" ||
        pathname === "/admin/dashboard" ||
        pathname === "/dashboard")
    ) {
      return true;
    }
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const userRole = currentUser?.role || "Super Admin";

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
    showToast("Signed out successfully", "info");
    router.push("/login");
  };

  const getRoleBadgeGradient = () => {
    switch (userRole) {
      case "Sales Manager":
        return "linear-gradient(135deg, #f59e0b, #d97706)";
      case "Sales Executive":
        return "linear-gradient(135deg, #10b981, #059669)";
      case "Receptionist":
        return "linear-gradient(135deg, #8b5cf6, #7c3aed)";
      case "Accountant":
        return "linear-gradient(135deg, #06b6d4, #0891b2)";
      case "Super Admin":
      default:
        return "linear-gradient(135deg, #3b82f6, #1d4ed8)";
    }
  };

  return (
    <aside className={`app-sidebar ${isOpen ? "show" : ""}`} id="appSidebar">
      {/* Brand Logo */}
      <div className="sidebar-brand">
        <Link
          href={userRole === "Sales Executive" ? "/sales-executive/dashboard" : "/admin/dashboard"}
          className="d-flex align-items-center gap-2 text-decoration-none overflow-hidden"
          onClick={onCloseMobile}
        >
          <div className="brand-logo-badge">
            <img src="/image/logo.png" alt="Defence Autolink Logo" />
          </div>
          <div className="brand-text d-flex flex-column" style={{ minWidth: 0 }}>
            <span className="brand-title text-truncate">Defence Autolink</span>
            <span className="brand-subtitle text-truncate">
              {userRole} Workspace
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav-container">
        {/* ===================================================================
            1. SALES EXECUTIVE MENU
            =================================================================== */}
        {userRole === "Sales Executive" && (
          <>
            <div className="nav-section-title">Conversion Desk</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/sales-executive/dashboard"
                  className={`nav-link ${isLinkActive("/sales-executive/dashboard") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-grid-1x2-fill"></i>
                  <span>Sales Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/sales-executive/leads"
                  className={`nav-link ${isLinkActive("/sales-executive/leads") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-funnel-fill"></i>
                  <span>My Assigned Leads</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/follow-up"
                  className={`nav-link ${isLinkActive("/admin/follow-up") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-telephone-outbound-fill"></i>
                  <span>Follow-Ups & Notes</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/quotation"
                  className={`nav-link ${isLinkActive("/admin/quotation") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                  <span>Send Quotation</span>
                </Link>
              </li>
            </ul>

            <div className="nav-section-title">Vehicle Inventory</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/admin/brand"
                  className={`nav-link ${isLinkActive("/admin/brand") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-shield-shaded"></i>
                  <span>Brands</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/model"
                  className={`nav-link ${isLinkActive("/admin/model") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-car-front-fill"></i>
                  <span>Models</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/variant"
                  className={`nav-link ${isLinkActive("/admin/variant") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-tag-fill"></i>
                  <span>Variants & Prices</span>
                </Link>
              </li>
            </ul>
          </>
        )}

        {/* ===================================================================
            2. SALES MANAGER MENU
            =================================================================== */}
        {userRole === "Sales Manager" && (
          <>
            <div className="nav-section-title">Team Leadership</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/admin/dashboard"
                  className={`nav-link ${isLinkActive("/admin/dashboard") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-grid-1x2-fill"></i>
                  <span>Manager Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/leads"
                  className={`nav-link ${isLinkActive("/admin/leads") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-funnel-fill"></i>
                  <span>Team Leads Pipeline</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/follow-up"
                  className={`nav-link ${isLinkActive("/admin/follow-up") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-telephone-outbound-fill"></i>
                  <span>Follow-Ups & Call Logs</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/quotation"
                  className={`nav-link ${isLinkActive("/admin/quotation") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                  <span>Quotation Approvals</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/users"
                  className={`nav-link ${isLinkActive("/admin/users") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-people-fill"></i>
                  <span>Sales Reps Team</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/reports"
                  className={`nav-link ${isLinkActive("/admin/reports") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-bar-chart-line-fill"></i>
                  <span>Performance Reports</span>
                </Link>
              </li>
            </ul>

            <div className="nav-section-title">Vehicle Inventory</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/admin/brand"
                  className={`nav-link ${isLinkActive("/admin/brand") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-shield-shaded"></i>
                  <span>Brands</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/model"
                  className={`nav-link ${isLinkActive("/admin/model") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-car-front-fill"></i>
                  <span>Models</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/variant"
                  className={`nav-link ${isLinkActive("/admin/variant") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-tag-fill"></i>
                  <span>Variants & Pricing</span>
                </Link>
              </li>
            </ul>
          </>
        )}

        {/* ===================================================================
            3. RECEPTIONIST MENU
            =================================================================== */}
        {userRole === "Receptionist" && (
          <>
            <div className="nav-section-title">Front Desk Desk</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/admin/dashboard"
                  className={`nav-link ${isLinkActive("/admin/dashboard") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-door-open-fill"></i>
                  <span>Reception Concierge</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/leads"
                  className={`nav-link ${isLinkActive("/admin/leads") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-funnel-fill"></i>
                  <span>Walk-Ins & Leads</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/follow-up"
                  className={`nav-link ${isLinkActive("/admin/follow-up") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-calendar2-check-fill"></i>
                  <span>Scheduled Visits</span>
                </Link>
              </li>
            </ul>

            <div className="nav-section-title">Showroom Catalog</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/admin/brand"
                  className={`nav-link ${isLinkActive("/admin/brand") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-shield-shaded"></i>
                  <span>Brands</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/model"
                  className={`nav-link ${isLinkActive("/admin/model") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-car-front-fill"></i>
                  <span>Vehicle Models</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/variant"
                  className={`nav-link ${isLinkActive("/admin/variant") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-tag-fill"></i>
                  <span>Variants</span>
                </Link>
              </li>
            </ul>
          </>
        )}

        {/* ===================================================================
            4. ACCOUNTANT MENU
            =================================================================== */}
        {userRole === "Accountant" && (
          <>
            <div className="nav-section-title">Finance & Billing</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/admin/dashboard"
                  className={`nav-link ${isLinkActive("/admin/dashboard") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-calculator-fill"></i>
                  <span>Accounts Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/quotation"
                  className={`nav-link ${isLinkActive("/admin/quotation") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                  <span>Quotations & Invoicing</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/leads"
                  className={`nav-link ${isLinkActive("/admin/leads") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-cash-stack"></i>
                  <span>Deals & Bookings</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/reports"
                  className={`nav-link ${isLinkActive("/admin/reports") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-bar-chart-line-fill"></i>
                  <span>Financial Reports</span>
                </Link>
              </li>
            </ul>

            <div className="nav-section-title">Pricing Master</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/admin/variant"
                  className={`nav-link ${isLinkActive("/admin/variant") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-tag-fill"></i>
                  <span>Variants & Taxes</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/update-price"
                  className={`nav-link ${isLinkActive("/admin/update-price") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-currency-rupee"></i>
                  <span>Update Pricing</span>
                </Link>
              </li>
            </ul>
          </>
        )}

        {/* ===================================================================
            5. SUPER ADMIN MENU (FULL SYSTEM ACCESS)
            =================================================================== */}
        {userRole === "Super Admin" && (
          <>
            <div className="nav-section-title">Main Menu</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/admin/dashboard"
                  className={`nav-link ${isLinkActive("/admin/dashboard") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-grid-1x2-fill"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/leads"
                  className={`nav-link ${isLinkActive("/admin/leads") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-funnel-fill"></i>
                  <span>Leads Pipeline</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/follow-up"
                  className={`nav-link ${isLinkActive("/admin/follow-up") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-telephone-outbound-fill"></i>
                  <span>Follow-Ups</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/users"
                  className={`nav-link ${isLinkActive("/admin/users") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-people-fill"></i>
                  <span>Users & Team</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/reports"
                  className={`nav-link ${isLinkActive("/admin/reports") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-bar-chart-line-fill"></i>
                  <span>Reports & Analytics</span>
                </Link>
              </li>
            </ul>

            <div className="nav-section-title">Master Data</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/admin/brand"
                  className={`nav-link ${isLinkActive("/admin/brand") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-shield-shaded"></i>
                  <span>Brands</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/model"
                  className={`nav-link ${isLinkActive("/admin/model") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-car-front-fill"></i>
                  <span>Models</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/variant"
                  className={`nav-link ${isLinkActive("/admin/variant") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-tag-fill"></i>
                  <span>Variants</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/update-price"
                  className={`nav-link ${isLinkActive("/admin/update-price") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-currency-rupee"></i>
                  <span>Update Price</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/quotation"
                  className={`nav-link ${isLinkActive("/admin/quotation") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                  <span>Send Quotation</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/lead-source"
                  className={`nav-link ${isLinkActive("/admin/lead-source") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-diagram-3-fill"></i>
                  <span>Lead Sources</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/admin/lead-status"
                  className={`nav-link ${isLinkActive("/admin/lead-status") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-tags-fill"></i>
                  <span>Lead Statuses</span>
                </Link>
              </li>
            </ul>

            <div className="nav-section-title">Management</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <Link
                  href="/admin/settings"
                  className={`nav-link ${isLinkActive("/admin/settings") ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <i className="bi bi-gear-fill"></i>
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </>
        )}

        {/* Global Support Link */}
        <div className="nav-section-title">Support</div>
        <ul className="sidebar-nav">
          <li className="nav-item">
            <a
              href="#"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                showToast("Dealership CRM Helpdesk is available 24/7", "info");
              }}
            >
              <i className="bi bi-question-circle-fill"></i>
              <span>Help & Support</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Sidebar User Profile Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: getRoleBadgeGradient(),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1rem",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="sidebar-user-info" style={{ minWidth: 0 }}>
            <h6 className="sidebar-user-name text-truncate">{currentUser?.name || "Alexander Vance"}</h6>
            <p className="sidebar-user-role text-truncate">{userRole}</p>
          </div>
          <button
            type="button"
            className="btn btn-link text-secondary p-0 border-0"
            title="Sign Out"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
