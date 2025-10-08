// Permission constants for role-based access control

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  BUSINESS_OWNER: 'business_owner',
  BUSINESS_EMPLOYEE: 'business_employee',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Permissions that can be assigned to roles
export const PERMISSIONS = {
  // Business Management
  VIEW_BUSINESS: 'view_business',
  EDIT_BUSINESS: 'edit_business',
  DELETE_BUSINESS: 'delete_business',
  
  // Staff Management
  VIEW_STAFF: 'view_staff',
  MANAGE_STAFF: 'manage_staff',
  
  // Services Management
  VIEW_SERVICES: 'view_services',
  MANAGE_SERVICES: 'manage_services',
  
  // Bookings Management
  VIEW_ALL_BOOKINGS: 'view_all_bookings',
  VIEW_OWN_BOOKINGS: 'view_own_bookings',
  MANAGE_ALL_BOOKINGS: 'manage_all_bookings',
  MANAGE_OWN_BOOKINGS: 'manage_own_bookings',
  CREATE_BOOKINGS: 'create_bookings',
  
  // Settings
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',
  
  // Billing (Owner only)
  VIEW_BILLING: 'view_billing',
  MANAGE_BILLING: 'manage_billing',
  
  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  
  // Admin (Super Admin only)
  ADMIN_ACCESS: 'admin_access',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Default permissions per role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.ADMIN_ACCESS,
    // Super admin has all permissions
    ...Object.values(PERMISSIONS),
  ],
  
  [ROLES.BUSINESS_OWNER]: [
    PERMISSIONS.VIEW_BUSINESS,
    PERMISSIONS.EDIT_BUSINESS,
    PERMISSIONS.DELETE_BUSINESS,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.MANAGE_STAFF,
    PERMISSIONS.VIEW_SERVICES,
    PERMISSIONS.MANAGE_SERVICES,
    PERMISSIONS.VIEW_ALL_BOOKINGS,
    PERMISSIONS.MANAGE_ALL_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.EDIT_SETTINGS,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  
  [ROLES.BUSINESS_EMPLOYEE]: [
    PERMISSIONS.VIEW_BUSINESS,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.VIEW_SERVICES,
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.MANAGE_OWN_BOOKINGS,
    PERMISSIONS.VIEW_SETTINGS, // Read-only
  ],
};

// Helper to check if a role has a permission
export function hasPermission(role: Role, permission: Permission, customPermissions?: Permission[]): boolean {
  if (role === ROLES.SUPER_ADMIN) return true;
  
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  const permissions = customPermissions || rolePermissions;
  
  return permissions.includes(permission);
}

// Helper to get all permissions for a role
export function getPermissions(role: Role, customPermissions?: Permission[]): Permission[] {
  if (customPermissions && customPermissions.length > 0) {
    return customPermissions;
  }
  
  return ROLE_PERMISSIONS[role] || [];
}



