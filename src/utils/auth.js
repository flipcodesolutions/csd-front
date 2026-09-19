/**
 * Authentication and Role-Based Access Control (RBAC) Utilities
 * Clean, simple vanilla JavaScript helpers for role and permission checks.
 */

/**
 * Get the currently logged-in user object from localStorage
 * @returns {Object|null}
 */
export function getAuthenticatedUser() {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error reading authenticated user from localStorage:", error);
    return null;
  }
}

/**
 * Get the current auth token
 * @returns {string|null}
 */
export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * Check if the current session is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Normalize role string for reliable comparison
 * e.g. "Super Admin" -> "super_admin", "Sales Executive" -> "sales_executive"
 * @param {string} role
 * @returns {string}
 */
export function normalizeRole(role) {
  if (!role) return "";
  return String(role)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

/**
 * Check if the authenticated user has one of the specified roles
 * Example: hasRole('admin') or hasRole(['admin', 'manager'])
 *
 * @param {string|string[]} roles - Single role string or array of allowed roles
 * @param {Object} [customUser] - Optional user object to test against
 * @returns {boolean}
 */
export function hasRole(roles, customUser = null) {
  const user = customUser || getAuthenticatedUser();
  if (!user || !user.role) return false;

  const currentRole = normalizeRole(user.role);

  // Normalize allowed roles
  const allowedRoles = (Array.isArray(roles) ? roles : [roles]).map(normalizeRole);

  // Super admin matches 'admin' or 'super_admin'
  const isMatch = allowedRoles.some((role) => {
    if (role === "admin" && (currentRole === "super_admin" || currentRole === "admin")) return true;
    if (role === "manager" && (currentRole === "sales_manager" || currentRole === "manager")) return true;
    if (role === "sales_executive" && (currentRole === "sales_executive" || currentRole === "sales")) return true;
    return currentRole === role;
  });

  return isMatch;
}

/**
 * Role to Permissions Mapping
 */
const ROLE_PERMISSIONS = {
  super_admin: [
    "lead.view_all",
    "lead.view_assigned",
    "lead.create",
    "lead.edit",
    "lead.delete",
    "lead.assign",
    "lead.bulk_action",
    "lead.followup",
    "lead.export",
    "lead.send_greetings",
    "user.view",
    "user.create",
    "user.edit",
    "user.delete",
    "user.manage",
    "quotation.view",
    "quotation.create",
    "quotation.edit",
    "quotation.delete",
    "quotation.discount_approval",
    "inventory.manage",
    "price.update",
    "reports.view",
    "settings.manage",
  ],
  sales_manager: [
    "lead.view_all",
    "lead.view_assigned",
    "lead.create",
    "lead.edit",
    "lead.assign",
    "lead.bulk_action",
    "lead.followup",
    "lead.export",
    "user.view",
    "quotation.view",
    "quotation.create",
    "quotation.edit",
    "quotation.discount_approval",
    "inventory.view",
    "reports.view",
  ],
  sales_executive: [
    "lead.view_assigned",
    "lead.edit_assigned",
    "lead.followup",
    "quotation.view",
    "quotation.create",
    "quotation.edit_assigned",
    "inventory.view",
  ],
  receptionist: [
    "lead.view_all",
    "lead.walkin_register",
    "lead.followup_view",
    "inventory.view",
  ],
  accountant: [
    "lead.view_all",
    "lead.export",
    "quotation.view",
    "quotation.create",
    "quotation.edit",
    "payment.verify",
    "price.update",
    "reports.view",
    "inventory.view",
  ],
};

/**
 * Check if the authenticated user has a specific permission
 * Example: hasPermission('lead.assign')
 *
 * @param {string} permission - Permission key
 * @param {Object} [customUser] - Optional user object to test against
 * @returns {boolean}
 */
export function hasPermission(permission, customUser = null) {
  const user = customUser || getAuthenticatedUser();
  if (!user || !user.role) return false;

  const currentRole = normalizeRole(user.role);

  // Fallback for aliases
  let roleKey = currentRole;
  if (roleKey === "admin") roleKey = "super_admin";
  if (roleKey === "manager") roleKey = "sales_manager";

  const permissions = ROLE_PERMISSIONS[roleKey] || [];

  // Direct check
  if (permissions.includes(permission)) return true;

  // General edit permission satisfies edit_assigned for managers/admins
  if (permission === "lead.edit_assigned" && permissions.includes("lead.edit")) return true;
  if (permission === "lead.view_assigned" && permissions.includes("lead.view_all")) return true;

  return false;
}

/**
 * Return formatted badge class for user role
 * @param {string} role
 * @returns {string}
 */
export function getRoleBadgeClass(role) {
  const r = normalizeRole(role);
  switch (r) {
    case "super_admin":
    case "admin":
      return "bg-danger-subtle text-danger";
    case "sales_manager":
    case "manager":
      return "bg-warning-subtle text-warning";
    case "sales_executive":
    case "sales":
      return "bg-primary-subtle text-primary";
    case "receptionist":
      return "bg-info-subtle text-info";
    case "accountant":
      return "bg-secondary-subtle text-white";
    default:
      return "bg-secondary-subtle text-muted";
  }
}
