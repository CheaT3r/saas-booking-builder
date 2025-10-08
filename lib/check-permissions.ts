import { db } from '@/db';
import { userRoles } from '@/db/schema/admin';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ROLES, PERMISSIONS, hasPermission, Permission, Role } from './permissions';

interface PermissionCheckResult {
  authorized: boolean;
  error?: string;
  userId?: string;
  role?: Role;
  businessId?: string;
  permissions?: Permission[];
}

/**
 * Check if user has permission for a specific business
 */
export async function checkBusinessPermission(
  requiredPermission: Permission,
  businessId?: string
): Promise<PermissionCheckResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { authorized: false, error: 'Unauthorized' };
    }

    // Get all roles for this user
    const userRolesList = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, session.user.id));

    // Check super admin first (has all permissions)
    const superAdminRole = userRolesList.find(r => r.role === ROLES.SUPER_ADMIN);
    if (superAdminRole) {
      return {
        authorized: true,
        userId: session.user.id,
        role: ROLES.SUPER_ADMIN,
        permissions: Object.values(PERMISSIONS),
      };
    }

    // If businessId is provided, check business-specific permissions
    if (businessId) {
      // Check if user is owner of the business
      const ownerRole = userRolesList.find(
        r => r.role === ROLES.BUSINESS_OWNER && !r.businessId // Owners don't have businessId set
      );

      // Check if user is employee of this specific business
      const employeeRole = userRolesList.find(
        r => r.role === ROLES.BUSINESS_EMPLOYEE && r.businessId === businessId
      );

      const role = ownerRole || employeeRole;

      if (role) {
        const userPermissions = (role.permissions as Permission[]) || [];
        const roleHasPermission = hasPermission(role.role as Role, requiredPermission, userPermissions);

        if (roleHasPermission) {
          return {
            authorized: true,
            userId: session.user.id,
            role: role.role as Role,
            businessId: role.businessId || undefined,
            permissions: userPermissions,
          };
        }
      }
    }

    // No businessId provided, check if user has business_owner role
    const ownerRole = userRolesList.find(r => r.role === ROLES.BUSINESS_OWNER);
    if (ownerRole) {
      const userPermissions = (ownerRole.permissions as Permission[]) || [];
      const roleHasPermission = hasPermission(ROLES.BUSINESS_OWNER, requiredPermission, userPermissions);

      if (roleHasPermission) {
        return {
          authorized: true,
          userId: session.user.id,
          role: ROLES.BUSINESS_OWNER,
          permissions: userPermissions,
        };
      }
    }

    return {
      authorized: false,
      error: 'Forbidden - Insufficient permissions',
    };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return { authorized: false, error: 'Internal server error' };
  }
}

/**
 * Check if user is owner of a specific business
 */
export async function checkIsBusinessOwner(businessId: string): Promise<PermissionCheckResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { authorized: false, error: 'Unauthorized' };
    }

    // Import businesses to check ownership
    const { businesses } = await import('@/db/schema/business');

    const business = await db
      .select()
      .from(businesses)
      .where(and(eq(businesses.id, businessId), eq(businesses.ownerId, session.user.id)))
      .limit(1);

    if (business.length === 0) {
      return {
        authorized: false,
        error: 'Forbidden - Not the business owner',
      };
    }

    return {
      authorized: true,
      userId: session.user.id,
      role: ROLES.BUSINESS_OWNER,
      businessId: businessId,
    };
  } catch (error) {
    console.error('Error checking business ownership:', error);
    return { authorized: false, error: 'Internal server error' };
  }
}

/**
 * Check if user has access to a business (either as owner or employee)
 */
export async function checkBusinessAccess(businessId: string): Promise<PermissionCheckResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { authorized: false, error: 'Unauthorized' };
    }

    // Check if super admin
    const superAdminCheck = await checkIsSuperAdmin();
    if (superAdminCheck.authorized) {
      return {
        authorized: true,
        userId: session.user.id,
        role: ROLES.SUPER_ADMIN,
      };
    }

    // Check if business owner
    const ownerCheck = await checkIsBusinessOwner(businessId);
    if (ownerCheck.authorized) {
      return ownerCheck;
    }

    // Check if employee of this business
    const employeeRole = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, session.user.id),
          eq(userRoles.role, ROLES.BUSINESS_EMPLOYEE),
          eq(userRoles.businessId, businessId)
        )
      )
      .limit(1);

    if (employeeRole.length > 0) {
      return {
        authorized: true,
        userId: session.user.id,
        role: ROLES.BUSINESS_EMPLOYEE,
        businessId: businessId,
        permissions: (employeeRole[0].permissions as Permission[]) || [],
      };
    }

    return {
      authorized: false,
      error: 'Forbidden - No access to this business',
    };
  } catch (error) {
    console.error('Error checking business access:', error);
    return { authorized: false, error: 'Internal server error' };
  }
}

// Re-export checkIsSuperAdmin from check-admin
import { checkIsSuperAdmin } from './check-admin';
export { checkIsSuperAdmin };



