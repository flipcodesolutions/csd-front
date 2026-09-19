"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import AdminLayout from "@/app/components/AdminLayout";
import { useToast } from "@/app/components/Toast";

export default function LeadsPage() {
  const { showToast } = useToast();

  // API Base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  // 1. Component States
  const [leads, setLeads] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sources, setSources] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selection & Bulk Action States
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [bulkAssignUser, setBulkAssignUser] = useState("");
  const [bulkAssignRemarks, setBulkAssignRemarks] = useState("");
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [openPriorityDropdown, setOpenPriorityDropdown] = useState(false);

  // Assignment History State for View Modal
  const [leadAssignmentHistory, setLeadAssignmentHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewLead, setViewLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Adding New Lead (matches user screenshot)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    birth_date: "",
    anniversary_date: "",
    vehicle_segment: "4 Wheeler", // "2 Wheeler" or "4 Wheeler"
    brand_id: "",
    model_variant: "",
    priority: "Hot", // "Hot", "Warm", "Cold"
    purchase_timeline: "Immediate (Within 7 Days)",
    source_id: "",
    status_id: "",
    assigned_user_name: "David Miller (Sales Executive)",
  });
  const [isTriggeringWishes, setIsTriggeringWishes] = useState(false);

  // 2. Fetch Leads & Master Dropdowns from Laravel backend
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/leads`);
      if (response.data && response.data.status) {
        setLeads(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching leads:", error);
      showToast("Unable to fetch leads from API.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [brandRes, sourceRes, statusRes, userRes] = await Promise.all([
        axios.get(`${API_URL}/brands`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_URL}/lead-sources`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_URL}/lead-statuses`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_URL}/users`).catch(() => ({ data: { data: [] } })),
      ]);

      if (brandRes.data?.data) setBrands(brandRes.data.data);
      if (sourceRes.data?.data) setSources(sourceRes.data.data);
      if (statusRes.data?.data) setStatuses(statusRes.data.data);
      if (userRes.data?.data) setUsersList(userRes.data.data);
    } catch (error) {
      console.log("Error fetching master dropdowns:", error);
    }
  };

  // Run on page mount
  useEffect(() => {
    fetchLeads();
    fetchMasterData();
  }, []);

  // 3. Create (Store) Lead
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Please enter customer name.", "error");
      return;
    }
    if (!formData.phone.trim()) {
      showToast("Please enter phone number.", "error");
      return;
    }
    if (!formData.model_variant.trim()) {
      showToast("Please enter desired variant/model.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/leads`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        birth_date: formData.birth_date || null,
        anniversary_date: formData.anniversary_date || null,
        vehicle_segment: formData.vehicle_segment,
        brand_id: formData.brand_id || null,
        model_variant: formData.model_variant.trim(),
        priority: formData.priority,
        purchase_timeline: formData.purchase_timeline,
        source_id: formData.source_id || null,
        status_id: formData.status_id || null,
        assigned_user_name: formData.assigned_user_name,
      });

      if (response.data && response.data.status) {
        showToast(`Lead created for "${formData.name}"!`, "success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          city: "",
          state: "",
          birth_date: "",
          anniversary_date: "",
          vehicle_segment: "4 Wheeler",
          brand_id: "",
          model_variant: "",
          priority: "Hot",
          purchase_timeline: "Immediate (Within 7 Days)",
          source_id: "",
          status_id: "",
          assigned_user_name: "David Miller (Sales Executive)",
        });
        setShowAddModal(false);
        fetchLeads(); // Refresh list
      }
    } catch (error) {
      console.log("Create Error:", error);
      const msg = error.response?.data?.message || "Failed to create customer lead.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Update (Edit) Lead
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editLead.name.trim()) {
      showToast("Please enter customer name.", "error");
      return;
    }
    if (!editLead.phone.trim()) {
      showToast("Please enter phone number.", "error");
      return;
    }
    if (!editLead.model_variant.trim()) {
      showToast("Please enter desired variant/model.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(`${API_URL}/leads/${editLead.id}`, {
        name: editLead.name.trim(),
        email: editLead.email ? editLead.email.trim() : "",
        phone: editLead.phone.trim(),
        city: editLead.city ? editLead.city.trim() : "",
        state: editLead.state ? editLead.state.trim() : "",
        birth_date: editLead.birth_date || null,
        anniversary_date: editLead.anniversary_date || null,
        vehicle_segment: editLead.vehicle_segment || "4 Wheeler",
        brand_id: editLead.brand_id || null,
        model_variant: editLead.model_variant.trim(),
        priority: editLead.priority || "Hot",
        purchase_timeline: editLead.purchase_timeline,
        source_id: editLead.source_id || null,
        status_id: editLead.status_id || null,
        assigned_user_name: editLead.assigned_user_name,
      });

      if (response.data && response.data.status) {
        showToast(`Lead for "${editLead.name}" updated!`, "success");
        setEditLead(null);
        fetchLeads(); // Refresh list
      }
    } catch (error) {
      console.log("Update Error:", error);
      const msg = error.response?.data?.message || "Failed to update lead.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Delete Lead
  const handleDeleteSubmit = async () => {
    if (!deleteTarget) return;

    try {
      const response = await axios.delete(`${API_URL}/leads/${deleteTarget.id}`);
      if (response.data && response.data.status) {
        showToast(`Lead record for "${deleteTarget.name}" deleted!`, "success");
        setDeleteTarget(null);
        fetchLeads(); // Refresh list
      }
    } catch (error) {
      console.log("Delete Error:", error);
      const msg = error.response?.data?.message || "Failed to delete lead.";
      showToast(msg, "error");
    }
  };

  // 6. Trigger Birthday & Anniversary Greetings Automation on Demand
  const handleTriggerGreetings = async () => {
    setIsTriggeringWishes(true);
    try {
      showToast("Running Birthday & Anniversary wishes automation...", "info");
      const res = await axios.post(`${API_URL}/leads/send-greetings-now`);
      if (res.data && res.data.status) {
        showToast(res.data.message || "Greetings sent successfully!", "success");
        fetchLeads();
      }
    } catch (err) {
      console.error("Trigger greetings error:", err);
      showToast(err.response?.data?.message || "Failed to trigger greetings.", "error");
    } finally {
      setIsTriggeringWishes(false);
    }
  };

  // Filter leads based on user selection
  const filteredLeads = leads.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model_variant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    const matchesSegment = !segmentFilter || item.vehicle_segment === segmentFilter;
    const matchesStatus = !statusFilter || item.status_name === statusFilter;

    return matchesSearch && matchesPriority && matchesSegment && matchesStatus;
  });

  // Selection calculations
  const isAllSelected =
    filteredLeads.length > 0 &&
    filteredLeads.every((item) => selectedLeadIds.includes(item.id));
  const isSomeSelected =
    filteredLeads.some((item) => selectedLeadIds.includes(item.id)) && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      const filteredIds = new Set(filteredLeads.map((l) => l.id));
      setSelectedLeadIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const newSelected = new Set(selectedLeadIds);
      filteredLeads.forEach((l) => newSelected.add(l.id));
      setSelectedLeadIds(Array.from(newSelected));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelectedLeadIds([]);
    setOpenStatusDropdown(false);
    setOpenPriorityDropdown(false);
  };

  // Bulk Operations Handlers
  const handleBulkStatusUpdate = async (statusId, statusName) => {
    if (selectedLeadIds.length === 0) return;
    setIsSubmitting(true);
    setOpenStatusDropdown(false);
    try {
      const response = await axios.post(`${API_URL}/leads/bulk-status`, {
        ids: selectedLeadIds,
        status_id: statusId,
        status_name: statusName,
      });
      if (response.data && response.data.status) {
        showToast(response.data.message || `Updated status to "${statusName}"!`, "success");
        setSelectedLeadIds([]);
        fetchLeads();
      }
    } catch (error) {
      console.log("Bulk status error:", error);
      try {
        await Promise.all(
          selectedLeadIds.map((id) => {
            const lead = leads.find((l) => l.id === id);
            if (!lead) return Promise.resolve();
            return axios.put(`${API_URL}/leads/${id}`, {
              name: lead.name,
              phone: lead.phone,
              email: lead.email || "",
              city: lead.city || "",
              state: lead.state || "",
              vehicle_segment: lead.vehicle_segment || "4 Wheeler",
              brand_id: lead.brand_id || null,
              model_variant: lead.model_variant,
              priority: lead.priority || "Hot",
              purchase_timeline: lead.purchase_timeline,
              source_id: lead.source_id || null,
              status_id: statusId,
              status_name: statusName,
              assigned_user_name: lead.assigned_user_name,
            });
          })
        );
        showToast(`Updated status for ${selectedLeadIds.length} leads to "${statusName}"!`, "success");
        setSelectedLeadIds([]);
        fetchLeads();
      } catch (fallbackErr) {
        showToast("Failed to update status for selected leads.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkPriorityUpdate = async (priority) => {
    if (selectedLeadIds.length === 0) return;
    setIsSubmitting(true);
    setOpenPriorityDropdown(false);
    try {
      const response = await axios.post(`${API_URL}/leads/bulk-priority`, {
        ids: selectedLeadIds,
        priority: priority,
      });
      if (response.data && response.data.status) {
        showToast(response.data.message || `Set priority to ${priority}!`, "success");
        setSelectedLeadIds([]);
        fetchLeads();
      }
    } catch (error) {
      console.log("Bulk priority error:", error);
      try {
        await Promise.all(
          selectedLeadIds.map((id) => {
            const lead = leads.find((l) => l.id === id);
            if (!lead) return Promise.resolve();
            return axios.put(`${API_URL}/leads/${id}`, {
              name: lead.name,
              phone: lead.phone,
              email: lead.email || "",
              city: lead.city || "",
              state: lead.state || "",
              vehicle_segment: lead.vehicle_segment || "4 Wheeler",
              brand_id: lead.brand_id || null,
              model_variant: lead.model_variant,
              priority: priority,
              purchase_timeline: lead.purchase_timeline,
              source_id: lead.source_id || null,
              status_id: lead.status_id || null,
              assigned_user_name: lead.assigned_user_name,
            });
          })
        );
        showToast(`Set priority for ${selectedLeadIds.length} leads to "${priority}"!`, "success");
        setSelectedLeadIds([]);
        fetchLeads();
      } catch (fallbackErr) {
        showToast("Failed to update priority for selected leads.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenViewLead = async (lead) => {
    setViewLead(lead);
    setLeadAssignmentHistory([]);
    setIsLoadingHistory(true);
    try {
      const response = await axios.get(`${API_URL}/leads/${lead.id}/assignments`);
      if (response.data && response.data.status) {
        setLeadAssignmentHistory(response.data.data || []);
      }
    } catch (err) {
      console.log("Error fetching lead assignments:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleBulkAssignSubmit = async () => {
    if (selectedLeadIds.length === 0 || !bulkAssignUser) return;
    setIsSubmitting(true);
    try {
      const selectedUserObj = usersList.find((u) => String(u.id) === String(bulkAssignUser) || u.name === bulkAssignUser);
      const userName = selectedUserObj ? selectedUserObj.name : bulkAssignUser;
      const userId = selectedUserObj ? selectedUserObj.id : (isFinite(bulkAssignUser) ? Number(bulkAssignUser) : null);

      const response = await axios.post(`${API_URL}/leads/bulk-assign`, {
        ids: selectedLeadIds,
        assigned_to: userId,
        assigned_user_name: userName,
        remarks: bulkAssignRemarks.trim() || undefined,
      });
      if (response.data && response.data.status) {
        showToast(response.data.message || `Assigned to ${userName}!`, "success");
        setShowBulkAssignModal(false);
        setBulkAssignUser("");
        setBulkAssignRemarks("");
        setSelectedLeadIds([]);
        fetchLeads();
      }
    } catch (error) {
      console.log("Bulk assign error:", error);
      try {
        const selectedUserObj = usersList.find((u) => String(u.id) === String(bulkAssignUser) || u.name === bulkAssignUser);
        const userName = selectedUserObj ? selectedUserObj.name : bulkAssignUser;
        const userId = selectedUserObj ? selectedUserObj.id : (isFinite(bulkAssignUser) ? Number(bulkAssignUser) : null);

        await Promise.all(
          selectedLeadIds.map((id) => {
            const lead = leads.find((l) => l.id === id);
            if (!lead) return Promise.resolve();
            return axios.put(`${API_URL}/leads/${id}`, {
              name: lead.name,
              phone: lead.phone,
              email: lead.email || "",
              city: lead.city || "",
              state: lead.state || "",
              vehicle_segment: lead.vehicle_segment || "4 Wheeler",
              brand_id: lead.brand_id || null,
              model_variant: lead.model_variant,
              priority: lead.priority || "Hot",
              purchase_timeline: lead.purchase_timeline,
              source_id: lead.source_id || null,
              status_id: lead.status_id || null,
              assigned_to: userId,
              assigned_user_name: userName,
              assignment_remarks: bulkAssignRemarks.trim() || undefined,
            });
          })
        );
        showToast(`Assigned ${selectedLeadIds.length} leads to "${userName}"!`, "success");
        setShowBulkAssignModal(false);
        setBulkAssignUser("");
        setBulkAssignRemarks("");
        setSelectedLeadIds([]);
        fetchLeads();
      } catch (fallbackErr) {
        showToast("Failed to assign selected leads.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDeleteSubmit = async () => {
    if (selectedLeadIds.length === 0) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/leads/bulk-delete`, {
        ids: selectedLeadIds,
      });
      if (response.data && response.data.status) {
        showToast(response.data.message || `Deleted ${selectedLeadIds.length} leads!`, "success");
        setShowBulkDeleteModal(false);
        setSelectedLeadIds([]);
        fetchLeads();
      }
    } catch (error) {
      console.log("Bulk delete error:", error);
      try {
        await Promise.all(
          selectedLeadIds.map((id) => axios.delete(`${API_URL}/leads/${id}`))
        );
        showToast(`Deleted ${selectedLeadIds.length} leads!`, "success");
        setShowBulkDeleteModal(false);
        setSelectedLeadIds([]);
        fetchLeads();
      } catch (fallbackErr) {
        showToast("Failed to delete selected leads.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = (exportSelectedOnly = false) => {
    const list = exportSelectedOnly
      ? leads.filter((l) => selectedLeadIds.includes(l.id))
      : filteredLeads;

    if (list.length === 0) {
      showToast("No leads available to export.", "warning");
      return;
    }

    const headers = [
      "ID",
      "Customer Name",
      "Phone",
      "Email",
      "City",
      "State",
      "Vehicle Segment",
      "Brand",
      "Model Variant",
      "Priority",
      "Purchase Timeline",
      "Source",
      "Status",
      "Assign To",
      "Assign By",
      "Created At",
    ];

    const csvRows = [
      headers.join(","),
      ...list.map((item) =>
        [
          item.id || "",
          `"${(item.name || "").replace(/"/g, '""')}"`,
          `"${(item.phone || "").replace(/"/g, '""')}"`,
          `"${(item.email || "").replace(/"/g, '""')}"`,
          `"${(item.city || "").replace(/"/g, '""')}"`,
          `"${(item.state || "").replace(/"/g, '""')}"`,
          `"${(item.vehicle_segment || "").replace(/"/g, '""')}"`,
          `"${(item.brand?.name || item.brand_name || "").replace(/"/g, '""')}"`,
          `"${(item.model_variant || "").replace(/"/g, '""')}"`,
          `"${(item.priority || "").replace(/"/g, '""')}"`,
          `"${(item.purchase_timeline || "").replace(/"/g, '""')}"`,
          `"${(item.source?.title || item.source_name || "Direct").replace(/"/g, '""')}"`,
          `"${(item.status?.name || item.status_name || "New").replace(/"/g, '""')}"`,
          `"${(item.assigned_to_display || item.assigned_user?.name || item.assigned_user_name || "-").replace(/"/g, '""')}"`,
          `"${(item.assigned_by_display || item.assigned_by_user?.name || "-").replace(/"/g, '""')}"`,
          `"${(item.created_at || "").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      exportSelectedOnly
        ? `selected_leads_${new Date().toISOString().slice(0, 10)}.csv`
        : `all_leads_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      `Exported ${list.length} ${exportSelectedOnly ? "selected " : ""}leads to CSV!`,
      "success"
    );
  };

  // Extract executive names list for assignment
  const defaultExecutives = [
    "David Miller (Sales Executive)",
    "Alexander Vance (Sales Director)",
    "Rajesh Kumar (Sales Executive)",
  ];
  const userExecList = usersList
    .filter((u) => u.status === "Active" || !u.status)
    .map((u) => `${u.name} (${u.role || "Executive"})`);
  const executiveOptions = Array.from(new Set([...userExecList, ...defaultExecutives]));

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
              <li className="breadcrumb-item active">Leads Pipeline</li>
            </ul>
            <h1 className="page-title mt-1">Leads & Prospects Pipeline</h1>
          </div>

          <div className="page-header-actions d-flex align-items-center gap-2 flex-wrap">
            <button
              className="btn btn-outline-custom d-flex align-items-center gap-1"
              style={{ color: "#f43f5e", borderColor: "rgba(244, 63, 94, 0.4)" }}
              onClick={handleTriggerGreetings}
              disabled={isTriggeringWishes}
              title="Dispatch automated Birthday & Anniversary greetings scheduled for today"
            >
              <i className="bi bi-gift-fill"></i>
              <span>{isTriggeringWishes ? "Sending..." : "Send Today's Wishes"}</span>
            </button>

            <Link href="/admin/follow-up" className="btn btn-outline-custom">
              <i className="bi bi-telephone-outbound-fill text-warning"></i>
              <span>Follow-Ups Hub</span>
            </Link>

            <Link href="/admin/quotation" className="btn btn-outline-custom">
              <i className="bi bi-file-earmark-spreadsheet-fill text-primary"></i>
              <span>Send Quotation</span>
            </Link>

            <button
              className="btn btn-outline-custom"
              onClick={() => handleExportCSV(false)}
              title="Download entire leads database as CSV"
            >
              <i className="bi bi-file-earmark-arrow-down"></i>
              <span>Export CSV</span>
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  city: "",
                  state: "",
                  birth_date: "",
                  anniversary_date: "",
                  vehicle_segment: "4 Wheeler",
                  brand_id: brands[0]?.id || "",
                  model_variant: "",
                  priority: "Hot",
                  purchase_timeline: "Immediate (Within 7 Days)",
                  source_id: sources[0]?.id || "",
                  status_id: statuses[0]?.id || "",
                  assigned_user_name: "David Miller (Sales Executive)",
                });
                setShowAddModal(true);
              }}
            >
              <i className="bi bi-plus-circle"></i>
              <span>Add Customer Lead</span>
            </button>
          </div>
        </div>

        {/* KPI Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Total Active Pipeline</span>
                <div className="stat-icon-box primary">
                  <i className="bi bi-funnel-fill"></i>
                </div>
              </div>
              <div className="stat-card-value">{leads.length} Leads</div>
              <span className="text-primary small fw-semibold">Live Database Records</span>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Hot Inquiries</span>
                <div className="stat-icon-box danger">
                  <i className="bi bi-fire"></i>
                </div>
              </div>
              <div className="stat-card-value">{leads.filter((l) => l.priority === "Hot").length} Hot</div>
              <span className="text-danger small fw-semibold">Immediate Buying Interest</span>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">4W Vehicles Inquired</span>
                <div className="stat-icon-box success">
                  <i className="bi bi-car-front-fill"></i>
                </div>
              </div>
              <div className="stat-card-value">
                {leads.filter((l) => l.vehicle_segment === "4 Wheeler").length} Leads
              </div>
              <span className="text-success small fw-semibold">Cars & SUVs Inquiries</span>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Selected Leads</span>
                <div className="stat-icon-box info">
                  <i className="bi bi-check-all"></i>
                </div>
              </div>
              <div className="stat-card-value">{selectedLeadIds.length} Selected</div>
              <span className="text-info small fw-semibold">
                {selectedLeadIds.length > 0 ? "Batch Actions Active" : "Click table checkboxes"}
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            FLOATING / DOCKED BULK ACTIONS BAR (Visible when leads are selected)
            ------------------------------------------------------------------ */}
        {selectedLeadIds.length > 0 && (
          <div className="bulk-actions-bar">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill text-warning fs-5"></i>
                <span className="text-white fw-bold">
                  <span className="badge bg-warning text-dark px-2 py-1 me-1 fs-6">
                    {selectedLeadIds.length}
                  </span>
                  {selectedLeadIds.length === 1 ? "Lead" : "Leads"} Selected
                </span>
              </div>
              <span className="text-muted small d-none d-md-inline">|</span>
              <span className="text-white-50 small d-none d-md-inline">
                Apply batch actions across selected records
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* Assign to Executive */}
              <button
                className="btn btn-sm btn-outline-custom text-white"
                onClick={() => {
                  setBulkAssignUser(executiveOptions[0] || "");
                  setShowBulkAssignModal(true);
                }}
              >
                <i className="bi bi-person-check-fill text-info me-1"></i>
                <span>Assign Executive</span>
              </button>

              {/* Bulk Status Update Dropdown */}
              <div className="dropdown position-relative">
                <button
                  className="btn btn-sm btn-outline-custom dropdown-toggle text-white"
                  type="button"
                  onClick={() => {
                    setOpenStatusDropdown(!openStatusDropdown);
                    setOpenPriorityDropdown(false);
                  }}
                >
                  <i className="bi bi-tags-fill text-warning me-1"></i>
                  <span>Update Status</span>
                </button>
                {openStatusDropdown && (
                  <div
                    className="bulk-dropdown-menu dropdown-menu show"
                    style={{ position: "absolute", right: 0, top: "110%" }}
                  >
                    <h6 className="dropdown-header text-white-50 px-2 py-1 small">Change Status To:</h6>
                    {statuses.length > 0 ? (
                      statuses.map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          className="dropdown-item"
                          onClick={() => handleBulkStatusUpdate(st.id, st.name)}
                        >
                          <i className="bi bi-arrow-right-circle text-primary"></i>
                          {st.name}
                        </button>
                      ))
                    ) : (
                      ["New", "Contacted", "Qualified", "In Negotiation", "Deal Won", "Deal Lost"].map(
                        (stName) => (
                          <button
                            key={stName}
                            type="button"
                            className="dropdown-item"
                            onClick={() => handleBulkStatusUpdate(null, stName)}
                          >
                            <i className="bi bi-arrow-right-circle text-primary"></i>
                            {stName}
                          </button>
                        )
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Bulk Priority Update Dropdown */}
              <div className="dropdown position-relative">
                <button
                  className="btn btn-sm btn-outline-custom dropdown-toggle text-white"
                  type="button"
                  onClick={() => {
                    setOpenPriorityDropdown(!openPriorityDropdown);
                    setOpenStatusDropdown(false);
                  }}
                >
                  <i className="bi bi-fire text-danger me-1"></i>
                  <span>Set Priority</span>
                </button>
                {openPriorityDropdown && (
                  <div
                    className="bulk-dropdown-menu dropdown-menu show"
                    style={{ position: "absolute", right: 0, top: "110%" }}
                  >
                    <h6 className="dropdown-header text-white-50 px-2 py-1 small">Set Temperature:</h6>
                    <button
                      type="button"
                      className="dropdown-item text-danger fw-semibold"
                      onClick={() => handleBulkPriorityUpdate("Hot")}
                    >
                      🔥 Hot Priority
                    </button>
                    <button
                      type="button"
                      className="dropdown-item text-warning fw-semibold"
                      onClick={() => handleBulkPriorityUpdate("Warm")}
                    >
                      ☀️ Warm Priority
                    </button>
                    <button
                      type="button"
                      className="dropdown-item text-info fw-semibold"
                      onClick={() => handleBulkPriorityUpdate("Cold")}
                    >
                      ❄️ Cold Priority
                    </button>
                  </div>
                )}
              </div>

              {/* Export Selected to CSV */}
              <button
                className="btn btn-sm btn-outline-custom text-white"
                onClick={() => handleExportCSV(true)}
                title="Download CSV for selected leads only"
              >
                <i className="bi bi-file-earmark-arrow-down text-success me-1"></i>
                <span>Export ({selectedLeadIds.length})</span>
              </button>

              {/* Bulk Delete */}
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => setShowBulkDeleteModal(true)}
              >
                <i className="bi bi-trash me-1"></i>
                <span>Delete</span>
              </button>

              {/* Clear selection */}
              <button
                className="btn btn-sm btn-link text-white-50 text-decoration-none p-1"
                onClick={handleClearSelection}
                title="Clear all selected"
              >
                <i className="bi bi-x-lg me-1"></i>Clear
              </button>
            </div>
          </div>
        )}

        {/* Leads Table Card */}
        <div className="card">
          <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div className="d-flex align-items-center gap-2">
              <h5 className="card-title mb-0">Customer Prospects</h5>
              <span className="badge bg-primary-subtle text-white rounded-pill px-2">
                {filteredLeads.length} Leads
              </span>
              {selectedLeadIds.length > 0 && (
                <span className="badge bg-warning-subtle text-warning border border-warning rounded-pill px-2">
                  {selectedLeadIds.length} Selected
                </span>
              )}
            </div>

            <div className="d-flex flex-wrap gap-2" style={{ maxWidth: "600px" }}>
              <select
                className="form-select form-select-sm"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{ width: "130px" }}
              >
                <option value="">All Priorities</option>
                <option value="Hot">🔥 Hot</option>
                <option value="Warm">☀️ Warm</option>
                <option value="Cold">❄️ Cold</option>
              </select>

              <select
                className="form-select form-select-sm"
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                style={{ width: "130px" }}
              >
                <option value="">All Segments</option>
                <option value="4 Wheeler">4 Wheeler</option>
                <option value="2 Wheeler">2 Wheeler</option>
              </select>

              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: "130px" }}
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search name, phone, model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "180px" }}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th style={{ width: "42px" }} className="text-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected;
                      }}
                      onChange={handleSelectAll}
                      title={isAllSelected ? "Deselect all visible leads" : "Select all visible leads"}
                      aria-label="Select all leads"
                    />
                  </th>
                  <th style={{ width: "45px" }}>#</th>
                  <th>Customer</th>
                  <th>Vehicle Requirement</th>
                  <th>Priority</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Assign To</th>
                  <th>Assign By</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4 text-muted">
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Loading leads from API...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4 text-muted">
                      No leads found. Click <strong>Add Customer Lead</strong> to register a new prospect.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, index) => {
                    const isSelected = selectedLeadIds.includes(lead.id);
                    return (
                      <tr key={lead.id} className={isSelected ? "selected-row" : ""}>
                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => handleSelectRow(lead.id)}
                            aria-label={`Select lead ${lead.name}`}
                          />
                        </td>
                        <td>
                          <span className="text-muted small">{index + 1}</span>
                        </td>
                        <td>
                          <div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <h6 className="mb-0 text-dark fw-bold">{lead.name}</h6>
                              {lead.is_birthday_today && (
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-0" style={{ fontSize: "10px" }}>
                                  🎂 Birthday Today
                                </span>
                              )}
                              {lead.is_anniversary_today && (
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-0" style={{ fontSize: "10px" }}>
                                  💐 Anniversary Today
                                </span>
                              )}
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <span className="text-muted small">
                                <i className="bi bi-telephone me-1"></i>
                                {lead.phone}
                              </span>
                              {lead.city && (
                                <span className="text-muted small">
                                  <i className="bi bi-geo-alt me-1"></i>
                                  {lead.city}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="text-dark fw-semibold">{lead.model_variant}</div>
                            <span className="badge bg-secondary-subtle text-black small" style={{ fontSize: "11px" }}>
                              {lead.brand?.name || lead.brand_name || lead.vehicle_segment}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${lead.priority === "Hot"
                              ? "bg-danger-subtle text-danger"
                              : lead.priority === "Warm"
                                ? "bg-warning-subtle text-warning"
                                : "bg-info-subtle text-info"
                              }`}
                          >
                            {lead.priority === "Hot" ? "🔥 Hot" : lead.priority === "Warm" ? "☀️ Warm" : "❄️ Cold"}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-dark border text-light">{lead.source?.title || lead.source_name || "Direct"}</span>
                        </td>
                        <td>
                          <span className="badge-custom badge-active">
                            <span className="badge-dot-indicator"></span>
                            {lead.status?.name || lead.status_name || "New"}
                          </span>
                        </td>
                        <td>
                          <span className="text-dark small fw-medium">
                            {lead.assigned_to_display || lead.assigned_user?.name || lead.assigned_user_name || "-"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${lead.assigned_by_display && lead.assigned_by_display !== "-"
                                ? "bg-secondary-subtle text-black border border-secondary fw-semibold"
                                : "text-muted"
                              } small px-2 py-1`}
                            style={{ fontSize: "11px" }}
                          >
                            {lead.assigned_by_display && lead.assigned_by_display !== "-" ? (
                              <>
                                <i className="bi bi-person-check-fill text-dark me-1"></i>
                                {lead.assigned_by_display}
                              </>
                            ) : (
                              "-"
                            )}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="table-actions justify-content-end">
                            <Link
                              href={`/admin/quotation/create?lead_id=${lead.id}`}
                              className="btn-action"
                              style={{ color: "#38bdf8" }}
                              title="Send Quotation"
                            >
                              <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                            </Link>
                            <button
                              className="btn-action btn-view"
                              title="View Details"
                              onClick={() => handleOpenViewLead(lead)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn-action btn-edit"
                              title="Edit Lead"
                              onClick={() =>
                                setEditLead({
                                  id: lead.id,
                                  name: lead.name,
                                  email: lead.email || "",
                                  phone: lead.phone,
                                  city: lead.city || "",
                                  state: lead.state || "",
                                  vehicle_segment: lead.vehicle_segment || "4 Wheeler",
                                  brand_id: lead.brand_id || "",
                                  model_variant: lead.model_variant,
                                  priority: lead.priority || "Hot",
                                  purchase_timeline: lead.purchase_timeline || "Immediate (Within 7 Days)",
                                  source_id: lead.source_id || "",
                                  status_id: lead.status_id || "",
                                  assigned_user_name: lead.assigned_user_name || "David Miller (Sales Executive)",
                                })
                              }
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn-action btn-delete"
                              title="Delete Lead"
                              onClick={() => setDeleteTarget(lead)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            ADD LEAD MODAL (Matches user's exact UI screenshot)
            ------------------------------------------------------------------ */}
        {showAddModal && (
          <div className="modal-backdrop-custom" onClick={() => setShowAddModal(false)}>
            <div
              className="modal-dialog-custom"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="modal-header-custom d-flex justify-content-between align-items-center">
                <h5 className="modal-title-custom d-flex align-items-center gap-2 text-white mb-0 fs-5 fw-bold">
                  <i className="bi bi-person-plus-fill text-info"></i> Add New Customer Lead
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className="modal-body-custom py-3">
                  {/* SECTION 1: Customer Details */}
                  <h6 className="text-dark fw-bold mb-3 pb-1 border-bottom border-secondary">
                    1. Customer Details
                  </h6>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">
                        Customer Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Captain Vikram Rathore"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        autoFocus
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="vikram.rathore@defmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+91 98765 43210"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">City</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Pune, Delhi, Jaipur"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">State</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Maharashtra, Rajasthan"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">
                        <i className="bi bi-cake2-fill text-danger me-1"></i> Birth Date (Birthday)
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.birth_date}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">
                        <i className="bi bi-heart-fill text-primary me-1"></i> Anniversary Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.anniversary_date}
                        onChange={(e) => setFormData({ ...formData, anniversary_date: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* SECTION 2: Vehicle Requirement & Lead Priority */}
                  <h6 className="text-dark fw-bold mb-3 pb-1 border-bottom border-secondary mt-4">
                    2. Vehicle Requirement & Lead Priority
                  </h6>

                  <div className="mb-3">
                    <label className="form-label text-dark fw-bold small mb-1">
                      Vehicle Segment <span className="text-danger">*</span>
                    </label>
                    <div
                      className="p-2 rounded-2 d-flex align-items-center gap-4"
                      style={{ background: "#181A1B", border: "1px solid #33383B" }}
                    >
                      <div className="form-check mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="addSeg"
                          id="addSeg2W"
                          value="2 Wheeler"
                          checked={formData.vehicle_segment === "2 Wheeler"}
                          onChange={(e) => setFormData({ ...formData, vehicle_segment: e.target.value })}
                        />
                        <label className="form-check-label text-dark small" htmlFor="addSeg2W">
                          <i className="bi bi-bicycle text-info me-1"></i> 2 Wheeler (Bike / Scooter)
                        </label>
                      </div>

                      <div className="form-check mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="addSeg"
                          id="addSeg4W"
                          value="4 Wheeler"
                          checked={formData.vehicle_segment === "4 Wheeler"}
                          onChange={(e) => setFormData({ ...formData, vehicle_segment: e.target.value })}
                        />
                        <label className="form-check-label text-dark small" htmlFor="addSeg4W">
                          <i className="bi bi-car-front-fill text-primary me-1"></i> 4 Wheeler (Car / SUV)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">Brand Name</label>
                      <select
                        className="form-select"
                        value={formData.brand_id}
                        onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                      >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">
                        Variant / Model <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Brezza ZDI, Classic 350, Apache RR310"
                        required
                        value={formData.model_variant}
                        onChange={(e) => setFormData({ ...formData, model_variant: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small mb-1">
                        Lead Priority / Temperature <span className="text-danger">*</span>
                      </label>
                      <div
                        className="p-2 rounded-2 d-flex align-items-center gap-3"
                        style={{ background: "#181A1B", border: "1px solid #33383B" }}
                      >
                        <div className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="addPriority"
                            id="addPrioHot"
                            value="Hot"
                            checked={formData.priority === "Hot"}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          />
                          <label className="form-check-label text-danger small fw-bold" htmlFor="addPrioHot">
                            🔥 Hot
                          </label>
                        </div>

                        <div className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="addPriority"
                            id="addPrioWarm"
                            value="Warm"
                            checked={formData.priority === "Warm"}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          />
                          <label className="form-check-label text-warning small fw-bold" htmlFor="addPrioWarm">
                            ☀️ Warm
                          </label>
                        </div>

                        <div className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="addPriority"
                            id="addPrioCold"
                            value="Cold"
                            checked={formData.priority === "Cold"}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          />
                          <label className="form-check-label text-info small fw-bold" htmlFor="addPrioCold">
                            ❄️ Cold
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">
                        Planning In (Purchase Timeline)
                      </label>
                      <select
                        className="form-select"
                        value={formData.purchase_timeline}
                        onChange={(e) => setFormData({ ...formData, purchase_timeline: e.target.value })}
                      >
                        <option value="Immediate (Within 7 Days)">Immediate (Within 7 Days)</option>
                        <option value="15-30 Days">15-30 Days</option>
                        <option value="1-3 Months">1-3 Months</option>
                        <option value="Exploring / Later">Exploring / Later</option>
                      </select>
                    </div>
                  </div>

                  {/* SECTION 3: Lead Tracking & Assignment */}
                  <h6 className="text-dark fw-bold mb-3 pb-1 border-bottom border-secondary mt-4">
                    3. Lead Tracking & Assignment
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">Lead Source</label>
                      <select
                        className="form-select"
                        value={formData.source_id}
                        onChange={(e) => setFormData({ ...formData, source_id: e.target.value })}
                      >
                        <option value="">Choose Source</option>
                        {sources.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">Lead Status</label>
                      <select
                        className="form-select"
                        value={formData.status_id}
                        onChange={(e) => setFormData({ ...formData, status_id: e.target.value })}
                      >
                        <option value="">Choose Status</option>
                        {statuses.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">Assigned Executive</label>
                      <select
                        className="form-select"
                        value={formData.assigned_user_name}
                        onChange={(e) => setFormData({ ...formData, assigned_user_name: e.target.value })}
                      >
                        <option value="David Miller (Sales Executive)">David Miller (Sales Executive)</option>
                        <option value="Alexander Vance (Sales Director)">Alexander Vance (Sales Director)</option>
                        <option value="Rajesh Kumar (Sales Executive)">Rajesh Kumar (Sales Executive)</option>
                      </select>
                    </div> */}
                  </div>
                </div>

                <div className="modal-footer-custom d-flex justify-content-end gap-2 pt-3">
                  <button
                    type="button"
                    className="btn btn-outline-custom"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary d-inline-flex align-items-center gap-1"
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-check2"></i>
                    <span>{isSubmitting ? "Saving..." : "Save Lead"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            EDIT LEAD MODAL
            ------------------------------------------------------------------ */}
        {editLead && (
          <div className="modal-backdrop-custom" onClick={() => setEditLead(null)}>
            <div
              className="modal-dialog-custom"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="modal-header-custom d-flex justify-content-between align-items-center">
                <h5 className="modal-title-custom d-flex align-items-center gap-2 text-white mb-0 fs-5 fw-bold">
                  <i className="bi bi-pencil-square text-info"></i> Edit Customer Lead
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setEditLead(null)}
                ></button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="modal-body-custom py-3">
                  {/* Customer Details */}
                  <h6 className="text-dark fw-bold mb-3 pb-1 border-bottom border-secondary">
                    1. Customer Details
                  </h6>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">
                        Customer Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={editLead.name}
                        onChange={(e) => setEditLead({ ...editLead, name: e.target.value })}
                        autoFocus
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editLead.email}
                        onChange={(e) => setEditLead({ ...editLead, email: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={editLead.phone}
                        onChange={(e) => setEditLead({ ...editLead, phone: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editLead.city}
                        onChange={(e) => setEditLead({ ...editLead, city: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editLead.state || ""}
                        onChange={(e) => setEditLead({ ...editLead, state: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">
                        <i className="bi bi-cake2-fill text-danger me-1"></i> Birth Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={editLead.birth_date ? (editLead.birth_date.split('T')[0] || editLead.birth_date) : ""}
                        onChange={(e) => setEditLead({ ...editLead, birth_date: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">
                        <i className="bi bi-heart-fill text-primary me-1"></i> Anniversary Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={editLead.anniversary_date ? (editLead.anniversary_date.split('T')[0] || editLead.anniversary_date) : ""}
                        onChange={(e) => setEditLead({ ...editLead, anniversary_date: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Vehicle Requirement */}
                  <h6 className="text-dark fw-bold mb-3 pb-1 border-bottom border-secondary mt-4">
                    2. Vehicle Requirement & Priority
                  </h6>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">Brand Name</label>
                      <select
                        className="form-select"
                        value={editLead.brand_id}
                        onChange={(e) => setEditLead({ ...editLead, brand_id: e.target.value })}
                      >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">
                        Variant / Model <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={editLead.model_variant}
                        onChange={(e) => setEditLead({ ...editLead, model_variant: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">Lead Priority</label>
                      <select
                        className="form-select"
                        value={editLead.priority}
                        onChange={(e) => setEditLead({ ...editLead, priority: e.target.value })}
                      >
                        <option value="Hot">🔥 Hot</option>
                        <option value="Warm">☀️ Warm</option>
                        <option value="Cold">❄️ Cold</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-dark fw-bold small">Purchase Timeline</label>
                      <select
                        className="form-select"
                        value={editLead.purchase_timeline}
                        onChange={(e) => setEditLead({ ...editLead, purchase_timeline: e.target.value })}
                      >
                        <option value="Immediate (Within 7 Days)">Immediate (Within 7 Days)</option>
                        <option value="15-30 Days">15-30 Days</option>
                        <option value="1-3 Months">1-3 Months</option>
                        <option value="Exploring / Later">Exploring / Later</option>
                      </select>
                    </div>
                  </div>

                  {/* Tracking */}
                  <h6 className="text-dark fw-bold mb-3 pb-1 border-bottom border-secondary mt-4">
                    3. Tracking & Assignment
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">Lead Source</label>
                      <select
                        className="form-select"
                        value={editLead.source_id}
                        onChange={(e) => setEditLead({ ...editLead, source_id: e.target.value })}
                      >
                        <option value="">Choose Source</option>
                        {sources.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">Lead Status</label>
                      <select
                        className="form-select"
                        value={editLead.status_id}
                        onChange={(e) => setEditLead({ ...editLead, status_id: e.target.value })}
                      >
                        <option value="">Choose Status</option>
                        {statuses.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-dark fw-bold small">Assigned Executive</label>
                      <select
                        className="form-select"
                        value={editLead.assigned_user_name}
                        onChange={(e) => setEditLead({ ...editLead, assigned_user_name: e.target.value })}
                      >
                        <option value="David Miller (Sales Executive)">David Miller (Sales Executive)</option>
                        <option value="Alexander Vance (Sales Director)">Alexander Vance (Sales Director)</option>
                        <option value="Rajesh Kumar (Sales Executive)">Rajesh Kumar (Sales Executive)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer-custom d-flex justify-content-end gap-2 pt-3">
                  <button
                    type="button"
                    className="btn btn-outline-custom"
                    onClick={() => setEditLead(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary d-inline-flex align-items-center gap-1"
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-check2"></i>
                    <span>{isSubmitting ? "Updating..." : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            VIEW LEAD DETAILS MODAL
            ------------------------------------------------------------------ */}
        {viewLead && (
          <div className="modal-backdrop-custom" onClick={() => setViewLead(null)}>
            <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
              <div className="modal-header-custom d-flex justify-content-between align-items-center">
                <h5 className="modal-title-custom d-flex align-items-center gap-2 text-white mb-0 fs-5 fw-bold">
                  <i className="bi bi-person-badge text-info"></i> Customer Lead Profile
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setViewLead(null)}
                ></button>
              </div>

              <div className="modal-body-custom py-3">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary">
                  <div>
                    <h5 className="text-dark fw-bold mb-0">{viewLead.name}</h5>
                    <span className="text-muted small">{viewLead.city ? `${viewLead.city}, ${viewLead.state || ""}` : "Location not specified"}</span>
                  </div>
                  <span
                    className={`badge ${viewLead.priority === "Hot"
                      ? "bg-danger-subtle text-danger"
                      : viewLead.priority === "Warm"
                        ? "bg-warning-subtle text-warning"
                        : "bg-info-subtle text-info"
                      }`}
                  >
                    {viewLead.priority} Priority
                  </span>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <span className="text-muted small d-block">Phone Number</span>
                    <strong className="text-dark">{viewLead.phone}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-muted small d-block">Email Address</span>
                    <strong className="text-dark">{viewLead.email || "N/A"}</strong>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted small d-block">Vehicle Inquired</span>
                    <strong className="text-info">{viewLead.model_variant}</strong>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted small d-block">Birth Date</span>
                    <strong className="text-dark d-flex align-items-center gap-1">
                      {viewLead.birth_date ? new Date(viewLead.birth_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                      {viewLead.is_birthday_today && (
                        <span className="badge bg-danger-subtle text-danger small">🎂 Today!</span>
                      )}
                    </strong>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted small d-block">Anniversary Date</span>
                    <strong className="text-dark d-flex align-items-center gap-1">
                      {viewLead.anniversary_date ? new Date(viewLead.anniversary_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                      {viewLead.is_anniversary_today && (
                        <span className="badge bg-primary-subtle text-primary small">💐 Today!</span>
                      )}
                    </strong>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted small d-block">Brand / Segment</span>
                    <strong className="text-dark">{viewLead.brand?.name || viewLead.brand_name || viewLead.vehicle_segment}</strong>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted small d-block">Pipeline Stage</span>
                    <span className="badge bg-success-subtle text-success">{viewLead.status?.name || viewLead.status_name || "New"}</span>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted small d-block">Assigned Executive</span>
                    <strong className="text-dark">{viewLead.assigned_to_display || viewLead.assigned_user?.name || viewLead.assigned_user_name || "-"}</strong>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted small d-block">Assigned By</span>
                    <strong className="text-dark">{viewLead.assigned_by_display || viewLead.assigned_by_user?.name || "-"}</strong>
                  </div>
                </div>

                {/* Assignment History Section */}
                <div className="mt-4 pt-3 border-top border-secondary">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="text-dark fw-bold mb-0 small">
                      <i className="bi bi-clock-history text-warning me-1"></i> Assignment History
                    </h6>
                    <span className="badge bg-secondary-subtle text-black small">
                      {leadAssignmentHistory.length} {leadAssignmentHistory.length === 1 ? "Record" : "Records"}
                    </span>
                  </div>

                  {isLoadingHistory ? (
                    <div className="text-center py-3 text-muted small">
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Loading history...
                    </div>
                  ) : leadAssignmentHistory.length === 0 ? (
                    <div className="text-muted small py-2 px-3 rounded-2 bg-dark border">
                      No reassignment history recorded yet.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: "180px", overflowY: "auto" }}>
                      {leadAssignmentHistory.map((hist) => (
                        <div
                          key={hist.id}
                          className="p-2 rounded-2"
                          style={{ background: "#161819", border: "1px solid #33383B" }}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="text-white fw-bold small">
                              <i className="bi bi-person-check text-info me-1"></i>
                              {hist.assign_to_name || "Unassigned"}
                            </span>
                            <span className="text-muted" style={{ fontSize: "11px" }}>
                              {new Date(hist.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mt-1">
                            <span className="text-muted" style={{ fontSize: "12px" }}>
                              By: <strong className="text-secondary">{hist.assign_by_name || "System"}</strong>
                            </span>
                            {hist.remarks && (
                              <span className="badge bg-dark border text-light" style={{ fontSize: "11px" }}>
                                {hist.remarks}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer-custom d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={() => setViewLead(null)}
                >
                  Close
                </button>
                <Link
                  href={`/admin/quotation/create?lead_id=${viewLead.id}`}
                  className="btn btn-primary d-inline-flex align-items-center gap-1"
                >
                  <i className="bi bi-file-earmark-spreadsheet-fill me-1"></i>
                  <span>Send Quotation</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            DELETE CONFIRMATION MODAL
            ------------------------------------------------------------------ */}
        {deleteTarget && (
          <div className="modal-backdrop-custom" onClick={() => setDeleteTarget(null)}>
            <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "450px" }}>
              <div className="modal-header-custom">
                <h5 className="modal-title-custom text-danger">
                  <i className="bi bi-exclamation-triangle-fill text-danger me-1"></i> Delete Customer Lead
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setDeleteTarget(null)}
                ></button>
              </div>

              <div className="modal-body-custom">
                <p className="text-dark mb-0">
                  Are you sure you want to delete lead for <strong>"{deleteTarget.name}"</strong>?
                </p>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteSubmit}>
                  Delete Lead
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            BULK ASSIGN EXECUTIVE MODAL
            ------------------------------------------------------------------ */}
        {showBulkAssignModal && (
          <div className="modal-backdrop-custom" onClick={() => setShowBulkAssignModal(false)}>
            <div
              className="modal-dialog-custom"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "480px" }}
            >
              <div className="modal-header-custom d-flex justify-content-between align-items-center">
                <h5 className="modal-title-custom d-flex align-items-center gap-2 text-white mb-0 fs-5 fw-bold">
                  <i className="bi bi-person-check-fill text-info"></i> Bulk Assign Executives
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowBulkAssignModal(false)}
                ></button>
              </div>

              <div className="modal-body-custom py-3">
                <div
                  className="p-3 mb-3 rounded-2"
                  style={{ background: "#181A1B", border: "1px solid #33383B" }}
                >
                  <span className="text-white small">
                    Assigning <strong>{selectedLeadIds.length}</strong> selected customer {selectedLeadIds.length === 1 ? "lead" : "leads"} to sales representative.
                  </span>
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark fw-bold small">
                    Choose Sales Executive <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={bulkAssignUser}
                    onChange={(e) => setBulkAssignUser(e.target.value)}
                    autoFocus
                  >
                    <option value="">-- Choose Sales Executive --</option>
                    {usersList.length > 0 ? (
                      usersList.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} {user.role ? `(${user.role})` : ""}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="David Miller (Sales Executive)">David Miller (Sales Executive)</option>
                        <option value="Alexander Vance (Sales Director)">Alexander Vance (Sales Director)</option>
                        <option value="Rajesh Kumar (Sales Executive)">Rajesh Kumar (Sales Executive)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="form-label text-dark fw-bold small">
                    Remarks / Assignment Note <span className="text-muted small fw-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Assigned for immediate follow-up on SUV requirement"
                    value={bulkAssignRemarks}
                    onChange={(e) => setBulkAssignRemarks(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer-custom d-flex justify-content-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={() => setShowBulkAssignModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center gap-1"
                  disabled={!bulkAssignUser || isSubmitting}
                  onClick={handleBulkAssignSubmit}
                >
                  <i className="bi bi-check2"></i>
                  <span>{isSubmitting ? "Assigning..." : `Assign ${selectedLeadIds.length} Leads`}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            BULK DELETE CONFIRMATION MODAL
            ------------------------------------------------------------------ */}
        {showBulkDeleteModal && (
          <div className="modal-backdrop-custom" onClick={() => setShowBulkDeleteModal(false)}>
            <div
              className="modal-dialog-custom"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "450px" }}
            >
              <div className="modal-header-custom">
                <h5 className="modal-title-custom text-danger">
                  <i className="bi bi-exclamation-triangle-fill text-danger me-1"></i> Delete Selected Leads
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowBulkDeleteModal(false)}
                ></button>
              </div>

              <div className="modal-body-custom">
                <p className="text-dark mb-0">
                  Are you sure you want to permanently delete <strong>{selectedLeadIds.length}</strong> selected lead {selectedLeadIds.length === 1 ? "record" : "records"}? This action cannot be reversed.
                </p>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={() => setShowBulkDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={isSubmitting}
                  onClick={handleBulkDeleteSubmit}
                >
                  {isSubmitting ? "Deleting..." : `Delete ${selectedLeadIds.length} Leads`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
