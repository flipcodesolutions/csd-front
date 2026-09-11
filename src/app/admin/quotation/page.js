"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/app/components/AdminLayout";
import { useToast } from "@/app/components/Toast";

export default function QuotationPage() {
  const { showToast } = useToast();

  // Quotation Builder State
  const [customerName, setCustomerName] = useState("Rajesh Verma");
  const [customerPhone, setCustomerPhone] = useState("+91 98231 44520");
  const [customerCity, setCustomerCity] = useState("South Extension, New Delhi");
  const [vehicleName, setVehicleName] = useState("Tata Safari Adventure Plus (Dark Edition)");
  const [quoteDate, setQuoteDate] = useState("02/09/2026");

  // Pricing components
  const [exShowroom, setExShowroom] = useState(2619000);
  const [rtoTax, setRtoTax] = useState(261900);
  const [insurance, setInsurance] = useState(89000);
  const [fastagKit, setFastagKit] = useState(2500);
  const [accessories, setAccessories] = useState(35000);
  const [extendedWarranty, setExtendedWarranty] = useState(28500);
  const [dealershipDiscount, setDealershipDiscount] = useState(45000);

  const totalOnRoad =
    exShowroom + rtoTax + insurance + fastagKit + accessories + extendedWarranty - dealershipDiscount;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleSendWhatsApp = () => {
    showToast(`Quotation PDF and breakdown sent to ${customerPhone} via WhatsApp!`, "success");
  };

  const handleSendEmail = () => {
    showToast(`Official price quotation emailed to customer!`, "success");
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
              <li className="breadcrumb-item">
                <Link href="/admin/leads">Pipeline</Link>
              </li>
              <li className="breadcrumb-item active">Send Quotation</li>
            </ul>
            <h1 className="page-title mt-1">Official Vehicle Price Quotation Maker</h1>
          </div>

          <div className="page-header-actions d-flex align-items-center gap-2 flex-wrap">
            <button className="btn btn-outline-custom" onClick={handlePrint}>
              <i className="bi bi-printer-fill"></i>
              <span>Print Quotation</span>
            </button>

            <button className="btn btn-outline-custom" onClick={handleSendEmail}>
              <i className="bi bi-envelope-fill text-warning"></i>
              <span>Email Customer</span>
            </button>

            <button
              className="btn btn-primary"
              style={{ background: "#25D366", borderColor: "#20b858" }}
              onClick={handleSendWhatsApp}
            >
              <i className="bi bi-whatsapp"></i>
              <span>Share WhatsApp Quote</span>
            </button>
          </div>
        </div>

        <div className="row g-4 mb-4">
          {/* ----------------------------------------------------
              LEFT PANEL: Quotation Builder Controls
              ---------------------------------------------------- */}
          <div className="col-xl-5">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-1">Quotation Parameters</h5>
                <p className="text-muted small mb-0">Adjust rates & discounts for live quote sheet</p>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-white fw-semibold small">Customer Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">City / Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-white fw-semibold small">Vehicle Model & Variant</label>
                    <input
                      type="text"
                      className="form-control"
                      value={vehicleName}
                      onChange={(e) => setVehicleName(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">Ex-Showroom Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={exShowroom}
                      onChange={(e) => setExShowroom(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">RTO & Road Tax (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={rtoTax}
                      onChange={(e) => setRtoTax(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">Insurance Premium (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={insurance}
                      onChange={(e) => setInsurance(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">Accessories Pack (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={accessories}
                      onChange={(e) => setAccessories(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold small">5-Yr Extended Warranty (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={extendedWarranty}
                      onChange={(e) => setExtendedWarranty(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-danger fw-semibold small">Dealership Discount (₹)</label>
                    <input
                      type="number"
                      className="form-control text-danger fw-bold"
                      value={dealershipDiscount}
                      onChange={(e) => setDealershipDiscount(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              RIGHT PANEL: Official Printable Dealership Quotation Sheet
              ---------------------------------------------------- */}
          <div className="col-xl-7">
            <div className="quotation-sheet-card" id="printableQuoteCard">
              {/* Header with Dealership Name & Address */}
              <div className="text-center mb-3">
                <div className="quote-header-brand">DEFENCE AUTOLINK</div>
                <div className="quote-header-address mt-2">
                  OFFICIAL MULTI-BRAND DEALERSHIP • SALES & SERVICES
                  <br />
                  Main Ring Road Showroom, South Extension Part-II, New Delhi - 110049
                  <br />
                  Contact: +91 98000 11111 / +91 98231 00001 • GSTIN: 07AAAAA0000A1Z5
                </div>
              </div>

              {/* Title Badge */}
              <div className="text-center mb-3">
                <div className="quote-title-box">VEHICLE PRICE QUOTATION SHEET</div>
              </div>

              {/* Customer and Date Row */}
              <div className="d-flex justify-content-between mb-3 text-dark small fw-bold">
                <div>
                  <span>CUSTOMER: </span>
                  <span className="text-uppercase text-danger">{customerName}</span> ({customerCity})
                  <br />
                  <span>CONTACT: </span>
                  <span>{customerPhone}</span>
                </div>
                <div className="text-end">
                  <span>DATE: </span>
                  <span>{quoteDate}</span>
                  <br />
                  <span>QUOTE REF: </span>
                  <span>DAL-QT-2026-0894</span>
                </div>
              </div>

              {/* Quotation Spreadsheet Grid Table */}
              <table className="table-quote-sheet">
                <thead>
                  <tr>
                    <th className="cell-param">DESCRIPTION / PARTICULARS</th>
                    <th className="cell-car-header">{vehicleName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="cell-param">EX-SHOWROOM PRICE</td>
                    <td className="text-end fw-bold">₹ {exShowroom.toLocaleString("en-IN")}/-</td>
                  </tr>

                  <tr>
                    <td className="cell-param">RTO REGISTRATION & ROAD TAX</td>
                    <td className="text-end">₹ {rtoTax.toLocaleString("en-IN")}/-</td>
                  </tr>

                  <tr>
                    <td className="cell-param">COMPREHENSIVE ZERO-DEP INSURANCE (1+3 YR)</td>
                    <td className="text-end">₹ {insurance.toLocaleString("en-IN")}/-</td>
                  </tr>

                  <tr>
                    <td className="cell-param">FASTAG & REGISTRATION PROCESSING</td>
                    <td className="text-end">₹ {fastagKit.toLocaleString("en-IN")}/-</td>
                  </tr>

                  <tr>
                    <td className="cell-param">GENUINE ESSENTIAL ACCESSORIES PACKAGE</td>
                    <td className="text-end">₹ {accessories.toLocaleString("en-IN")}/-</td>
                  </tr>

                  <tr>
                    <td className="cell-param">5 YEARS EXTENDED WARRANTY (UNLIMITED KM)</td>
                    <td className="text-end">₹ {extendedWarranty.toLocaleString("en-IN")}/-</td>
                  </tr>

                  <tr>
                    <td className="cell-param" style={{ color: "#d62828" }}>
                      SPECIAL DEALERSHIP PROMOTIONAL DISCOUNT
                    </td>
                    <td className="text-end fw-bold" style={{ color: "#d62828" }}>
                      - ₹ {dealershipDiscount.toLocaleString("en-IN")}/-
                    </td>
                  </tr>

                  <tr style={{ background: "#fef3c7" }}>
                    <td className="cell-param" style={{ fontSize: "1.05rem", color: "#000000" }}>
                      FINAL NET ON-ROAD PRICE
                    </td>
                    <td className="text-end fw-bold" style={{ fontSize: "1.2rem", color: "#d62828" }}>
                      ₹ {totalOnRoad.toLocaleString("en-IN")}/-
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Terms & Conditions Footer */}
              <div className="mt-4 pt-2 border-top text-dark" style={{ fontSize: "0.76rem", lineHeight: "1.4" }}>
                <p className="mb-1">
                  <strong>Terms & Conditions:</strong>
                </p>
                <ul className="ps-3 mb-2">
                  <li>Prices prevailing at the time of invoicing and delivery will be applicable.</li>
                  <li>Booking amount is non-interest bearing and subject to dealership terms.</li>
                  <li>Delivery is subject to vehicle allocation from manufacturer and receipt of full payment.</li>
                </ul>
                <div className="d-flex justify-content-between align-items-end mt-4 pt-3">
                  <div>
                    <span className="text-muted">Prepared By: Vikram Singh (Sales Director)</span>
                  </div>
                  <div className="text-end">
                    <span className="d-block text-dark fw-bold">For DEFENCE AUTOLINK</span>
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                      (Authorized Dealership Signatory)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
