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

  const isSalesExecutive = currentUser?.role === "Sales Executive";

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
    showToast("Signed out successfully", "info");
    router.push("/login");
  };

  return (
    <aside className={`app-sidebar ${isOpen ? "show" : ""}`} id="appSidebar">
      {/* Brand Logo */}
      <div className="sidebar-brand">
        <Link
          href={isSalesExecutive ? "/sales-executive/leads" : "/admin/dashboard"}
          className="d-flex align-items-center gap-2 text-decoration-none overflow-hidden"
          onClick={onCloseMobile}
        >
          <div className="brand-logo-badge">
            <img src="/image/logo.png" alt="Defence Autolink Logo" />
          </div>
          <div className="brand-text d-flex flex-column" style={{ minWidth: 0 }}>
            <span className="brand-title text-truncate">Defence Autolink</span>
            <span className="brand-subtitle text-truncate">
              {isSalesExecutive ? "Sales Executive Desk" : "Dealership CRM"}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav-container">
        {/* ===================================================================
            SALES EXECUTIVE MENU
            =================================================================== */}
        {isSalesExecutive ? (
          <>
            <div className="nav-section-title">Sales Desk</div>
            <ul className="sidebar-nav">
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
                  <span>Follow-Ups & Call Notes</span>
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
                  <span>Variants & Pricing</span>
                </Link>
              </li>
            </ul>

            <div className="nav-section-title">Support</div>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Sales Helpdesk is active 24/7", "info");
                  }}
                >
                  <i className="bi bi-question-circle-fill"></i>
                  <span>Help & Support</span>
                </a>
              </li>
            </ul>
          </>
        ) : (
          /* ===================================================================
             ADMIN / MANAGER MENU (ALL MENUS)
             =================================================================== */
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
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Help documentation is available 24/7", "info");
                  }}
                >
                  <i className="bi bi-question-circle-fill"></i>
                  <span>Help & Support</span>
                </a>
              </li>
            </ul>
          </>
        )}
      </div>

      {/* Sidebar User Profile Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: isSalesExecutive
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
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
            <p className="sidebar-user-role text-truncate">{currentUser?.role || "Super Admin"}</p>
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
