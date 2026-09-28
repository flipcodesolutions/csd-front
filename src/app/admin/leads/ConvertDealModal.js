"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dealApi from "@/services/dealApi";
import { numberToWords, formatIndianCurrency } from "@/utils/numberToWords";

export default function ConvertDealModal({
  isOpen,
  lead,
  onClose,
  onSuccess,
  showToast,
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State matching API specifications
  const [formData, setFormData] = useState({
    quotation_id: "",
    total_amount: "",
    discount_amount: "0",
    color: "",
    vin_chassis_number: "",
    expected_delivery_date: "",
    initial_payment: {
      amount: "",
      payment_type: "token_advance",
      payment_mode: "upi",
      transaction_reference: "",
      bank_name: "",
      notes: "",
    },
  });

  // Pre-fill dynamically when lead opens
  useEffect(() => {
    if (lead) {
      // Default delivery date: 15 days from now
      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 15);
      const deliveryStr = delivery.toISOString().split("T")[0];

      const leadBudget = lead.budget || lead.total_deal_amount || "";

      setFormData({
        quotation_id: lead.quotation_id || "",
        total_amount: leadBudget ? String(leadBudget) : "",
        discount_amount: "0",
        color: lead.color || "Standard",
        vin_chassis_number: lead.vin_chassis_number || "",
        expected_delivery_date: deliveryStr,
        initial_payment: {
          amount: "",
          payment_type: "token_advance",
          payment_mode: "upi",
          transaction_reference: "",
          bank_name: "",
          notes: "",
        },
      });
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const totalNum = parseFloat(formData.total_amount) || 0;
  const discountNum = parseFloat(formData.discount_amount) || 0;
  const netPayable = Math.max(0, totalNum - discountNum);
  const initialPayNum = parseFloat(formData.initial_payment.amount) || 0;
  const balancePending = Math.max(0, netPayable - initialPayNum);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.total_amount || totalNum <= 0) {
      showToast("Please enter a valid total deal amount.", "error");
      return;
    }

    if (discountNum > totalNum) {
      showToast("Discount amount cannot exceed total deal amount.", "error");
      return;
    }

    if (!formData.color.trim()) {
      showToast("Please specify the vehicle color.", "error");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      lead_id: Number(lead.id),
      quotation_id: formData.quotation_id ? Number(formData.quotation_id) : null,
      total_amount: totalNum,
      discount_amount: discountNum,
      color: formData.color.trim(),
      vin_chassis_number: formData.vin_chassis_number.trim(),
      expected_delivery_date: formData.expected_delivery_date,
      initial_payment: {
        amount: initialPayNum,
        payment_type: formData.initial_payment.payment_type,
        payment_mode: formData.initial_payment.payment_mode,
        transaction_reference: formData.initial_payment.transaction_reference.trim(),
        bank_name: formData.initial_payment.bank_name.trim(),
        notes: formData.initial_payment.notes.trim(),
      },
    };

    try {
      const res = await dealApi.convertLead(payload, lead);
      showToast(res.message || `Lead "${lead.name}" converted to Deal successfully!`, "success");
      setIsSubmitting(false);
      onSuccess(lead.id);
      onClose();

      // Offer immediate redirect to Deals
      setTimeout(() => {
        router.push("/admin/deals");
      }, 500);
    } catch (err) {
      console.error("Convert Deal Error:", err);
      showToast(err.response?.data?.message || "Failed to convert lead to deal.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose} style={{ zIndex: 1060 }}>
      <div
        className="modal-dialog-custom"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "780px" }}
      >
        <div className="modal-header-custom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #15803D, #166534)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              <i className="bi bi-trophy-fill"></i>
            </div>
            <div>
              <h5 className="modal-title-custom text-white mb-0 fw-bold">
                Convert Lead to Deal
              </h5>
              <span className="small text-light opacity-75">
                Lock vehicle booking, generate deal contract & record advance token
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-custom py-3" style={{ maxHeight: "78vh", overflowY: "auto" }}>
            {/* Customer & Vehicle Header Banner */}
            <div className="p-3 mb-3 bg-light rounded border d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Customer Prospect</span>
                <h6 className="mb-0 text-dark fw-bold">{lead.name}</h6>
                <div className="small text-muted">
                  <i className="bi bi-telephone me-1"></i>
                  {lead.phone} {lead.city ? `• ${lead.city}` : ""}
                </div>
              </div>
              <div className="text-end">
                <span className="text-muted small fw-semibold text-uppercase">Vehicle Model</span>
                <div className="fw-bold text-primary">{lead.model_variant}</div>
                <span className="badge bg-secondary-subtle text-dark border">
                  {lead.brand?.name || lead.brand_name || lead.vehicle_segment}
                </span>
              </div>
            </div>

            {/* SECTION 1: Deal Financials */}
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2 border-bottom pb-1">
              <i className="bi bi-currency-rupee text-success"></i> 1. Deal Pricing & Discount
            </h6>

            <div className="row g-3 mb-3">
              {/* Total Amount */}
              <div className="col-md-6">
                <label className="form-label text-dark fw-bold small mb-1">
                  Total Deal Amount (₹) <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-bold">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    className="form-control fw-bold"
                    placeholder="e.g. 1450000"
                    required
                    value={formData.total_amount}
                    onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                  />
                </div>
                {/* Formatted Number & In-Words Display */}
                {totalNum > 0 && (
                  <div className="mt-1 p-2 bg-light-subtle border rounded small">
                    <div className="text-dark fw-bold">
                      Formatted: ₹{formatIndianCurrency(totalNum)}
                    </div>
                    <div className="text-success fw-semibold fst-italic" style={{ fontSize: "11px" }}>
                      ✍️ In Words: {numberToWords(totalNum)}
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Amount */}
              <div className="col-md-6">
                <label className="form-label text-dark fw-bold small mb-1">
                  Discount Amount (₹)
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-bold">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    className="form-control"
                    placeholder="e.g. 25000"
                    value={formData.discount_amount}
                    onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                  />
                </div>
                {/* Formatted Discount & In-Words */}
                {discountNum > 0 && (
                  <div className="mt-1 p-2 bg-light-subtle border rounded small">
                    <div className="text-dark fw-bold">
                      Formatted: ₹{formatIndianCurrency(discountNum)}
                    </div>
                    <div className="text-muted fw-semibold fst-italic" style={{ fontSize: "11px" }}>
                      ✍️ In Words: {numberToWords(discountNum)}
                    </div>
                  </div>
                )}
              </div>

              {/* Net Deal Value Calculation Summary Banner */}
              <div className="col-12">
                <div className="p-3 bg-success-subtle border border-success-subtle rounded d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase">Net Final Deal Value</span>
                    <h5 className="mb-0 text-success fw-bold">
                      ₹{formatIndianCurrency(netPayable)}
                    </h5>
                    <div className="text-dark small fw-semibold fst-italic" style={{ fontSize: "11px" }}>
                      {numberToWords(netPayable)}
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success text-white px-2 py-1">
                      Ready for Booking
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Vehicle Delivery & Registration Info */}
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2 border-bottom pb-1">
              <i className="bi bi-car-front-fill text-primary"></i> 2. Vehicle Specification & Delivery
            </h6>

            <div className="row g-3 mb-3">
              {/* Color */}
              <div className="col-md-4">
                <label className="form-label text-dark fw-bold small mb-1">
                  Vehicle Color <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Pearl Metallic White"
                  required
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              {/* VIN / Chassis Number */}
              <div className="col-md-4">
                <label className="form-label text-dark fw-bold small mb-1">
                  VIN / Chassis Number
                </label>
                <input
                  type="text"
                  className="form-control font-monospace"
                  placeholder="e.g. MB8NA12347890123"
                  value={formData.vin_chassis_number}
                  onChange={(e) => setFormData({ ...formData, vin_chassis_number: e.target.value })}
                />
              </div>

              {/* Expected Delivery Date */}
              <div className="col-md-4">
                <label className="form-label text-dark fw-bold small mb-1">
                  Expected Delivery Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={formData.expected_delivery_date}
                  onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
                />
              </div>

              {/* Quotation ID (optional link) */}
              <div className="col-md-4">
                <label className="form-label text-dark fw-bold small mb-1">
                  Linked Quotation ID
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 2"
                  value={formData.quotation_id}
                  onChange={(e) => setFormData({ ...formData, quotation_id: e.target.value })}
                />
                <span className="form-text small text-muted">Optional if quotation exists</span>
              </div>
            </div>

            {/* SECTION 3: Initial Payment Details (Token Advance) */}
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2 border-bottom pb-1">
              <i className="bi bi-wallet2 text-warning"></i> 3. Initial Payment (Token Advance)
            </h6>

            <div className="p-3 bg-light rounded border mb-2">
              <div className="row g-3">
                {/* Advance Amount */}
                <div className="col-md-6">
                  <label className="form-label text-dark fw-bold small mb-1">
                    Advance Amount (₹) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white fw-bold">₹</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      className="form-control fw-bold"
                      placeholder="e.g. 51000"
                      required
                      value={formData.initial_payment.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          initial_payment: {
                            ...formData.initial_payment,
                            amount: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  {/* Formatted Advance & In-Words */}
                  {initialPayNum > 0 && (
                    <div className="mt-1 p-2 bg-white border rounded small">
                      <div className="text-dark fw-bold">
                        Formatted: ₹{formatIndianCurrency(initialPayNum)}
                      </div>
                      <div className="text-success fw-semibold fst-italic" style={{ fontSize: "11px" }}>
                        ✍️ In Words: {numberToWords(initialPayNum)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Type */}
                <div className="col-md-3">
                  <label className="form-label text-dark fw-bold small mb-1">
                    Payment Type
                  </label>
                  <select
                    className="form-select"
                    value={formData.initial_payment.payment_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        initial_payment: {
                          ...formData.initial_payment,
                          payment_type: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="token_advance">Token Advance</option>
                    <option value="down_payment">Down Payment</option>
                    <option value="part_payment">Part Payment</option>
                  </select>
                </div>

                {/* Payment Mode */}
                <div className="col-md-3">
                  <label className="form-label text-dark fw-bold small mb-1">
                    Payment Mode
                  </label>
                  <select
                    className="form-select"
                    value={formData.initial_payment.payment_mode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        initial_payment: {
                          ...formData.initial_payment,
                          payment_mode: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="upi">UPI / QR Code</option>
                    <option value="neft_rtgs">NEFT / RTGS</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque / DD</option>
                  </select>
                </div>

                {/* Conditional Fields: If Cash, hide Transaction Reference, Bank Name and Notes */}
                {formData.initial_payment.payment_mode === "cash" ? (
                  <div className="col-12">
                    {/* <div className="p-2 px-3 bg-white border border-success-subtle rounded d-flex align-items-center gap-2 text-success small">
                      <i className="bi bi-cash-stack fs-5 text-success"></i>
                      <div>
                        <strong>Cash Payment Mode:</strong> Transaction Reference, Bank Name aur Remarks cash ke liye required nahi hain. Cash counter par direct collect kiya jayega.
                      </div>
                    </div> */}
                  </div>
                ) : (
                  <>
                    {/* Transaction Reference */}
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small mb-1">
                        Transaction Reference / UTR
                      </label>
                      <input
                        type="text"
                        className="form-control font-monospace"
                        placeholder="e.g. UPI/98127391823/HDFC"
                        value={formData.initial_payment.transaction_reference}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            initial_payment: {
                              ...formData.initial_payment,
                              transaction_reference: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    {/* Bank Name */}
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. HDFC Bank, SBI"
                        value={formData.initial_payment.bank_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            initial_payment: {
                              ...formData.initial_payment,
                              bank_name: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    {/* Notes */}
                    <div className="col-12">
                      <label className="form-label text-dark fw-bold small mb-1">
                        Payment Notes / Remarks
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Booking token advance received"
                        value={formData.initial_payment.notes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            initial_payment: {
                              ...formData.initial_payment,
                              notes: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Remaining Balance Summary */}
            <div className="p-2 px-3 bg-light-subtle border rounded d-flex justify-content-between align-items-center">
              <span className="small text-muted">
                Initial Paid: <strong>₹{formatIndianCurrency(initialPayNum)}</strong>
              </span>
              <span className="small text-danger fw-bold">
                Remaining Balance Pending: ₹{formatIndianCurrency(balancePending)}
              </span>
            </div>
          </div>

          <div className="modal-footer-custom d-flex justify-content-between align-items-center pt-3">
            <span className="small text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Lead will move to Deals Pipeline automatically.
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-custom"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success d-inline-flex align-items-center gap-2 px-3"
                disabled={isSubmitting}
              >
                <i className="bi bi-check-circle-fill"></i>
                <span>{isSubmitting ? "Converting..." : "Confirm & Convert Deal"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
