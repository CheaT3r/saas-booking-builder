import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userRoles } from '@/db/schema/admin';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ROLES } from '@/lib/permissions';

// GET - Get current user's role (optionally for a specific business)
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if businessId is provided as query param
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    // Get all roles for this user
    const allUserRoles = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, session.user.id));

    if (allUserRoles.length === 0) {
      // Default role is 'business_owner' if not found
      return NextResponse.json({
        success: true,
        data: {
          userId: session.user.id,
          role: ROLES.BUSINESS_OWNER,
          permissions: [],
          isSuperAdmin: false,
          isBusinessOwner: true,
          isBusinessEmployee: false,
        },
      });
    }

    // Check if user is super admin (highest priority)
    const superAdminRole = allUserRoles.find(r => r.role === ROLES.SUPER_ADMIN);
    if (superAdminRole) {
      return NextResponse.json({
        success: true,
        data: {
          userId: session.user.id,
          role: ROLES.SUPER_ADMIN,
          permissions: superAdminRole.permissions || [],
          isSuperAdmin: true,
          isBusinessOwner: false,
          isBusinessEmployee: false,
        },
      });
    }

    // If businessId is provided, check for business-specific role
    if (businessId) {
      // Check if user is employee of this business
      const employeeRole = allUserRoles.find(
        r => r.role === ROLES.BUSINESS_EMPLOYEE && r.businessId === businessId
      );

      if (employeeRole) {
        return NextResponse.json({
          success: true,
          data: {
            userId: session.user.id,
            role: ROLES.BUSINESS_EMPLOYEE,
            businessId: businessId,
            permissions: employeeRole.permissions || [],
            isSuperAdmin: false,
            isBusinessOwner: false,
            isBusinessEmployee: true,
          },
        });
      }

      // Check if user is owner (owners don't have businessId set)
      const ownerRole = allUserRoles.find(r => r.role === ROLES.BUSINESS_OWNER);
      if (ownerRole) {
        return NextResponse.json({
          success: true,
          data: {
            userId: session.user.id,
            role: ROLES.BUSINESS_OWNER,
            permissions: ownerRole.permissions || [],
            isSuperAdmin: false,
            isBusinessOwner: true,
            isBusinessEmployee: false,
          },
        });
      }
    } else {
      // No businessId provided, return primary role (owner or employee)
      const ownerRole = allUserRoles.find(r => r.role === ROLES.BUSINESS_OWNER);
      if (ownerRole) {
        return NextResponse.json({
          success: true,
          data: {
            userId: session.user.id,
            role: ROLES.BUSINESS_OWNER,
            permissions: ownerRole.permissions || [],
            isSuperAdmin: false,
            isBusinessOwner: true,
            isBusinessEmployee: false,
          },
        });
      }

      // User is only an employee, return first employee role
      const employeeRole = allUserRoles.find(r => r.role === ROLES.BUSINESS_EMPLOYEE);
      if (employeeRole) {
        return NextResponse.json({
          success: true,
          data: {
            userId: session.user.id,
            role: ROLES.BUSINESS_EMPLOYEE,
            businessId: employeeRole.businessId || undefined,
            permissions: employeeRole.permissions || [],
            isSuperAdmin: false,
            isBusinessOwner: false,
            isBusinessEmployee: true,
          },
        });
      }
    }

    // Fallback to default business_owner role
    return NextResponse.json({
      success: true,
      data: {
        userId: session.user.id,
        role: ROLES.BUSINESS_OWNER,
        permissions: [],
        isSuperAdmin: false,
        isBusinessOwner: true,
        isBusinessEmployee: false,
      },
    });
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user role' },
      { status: 500 }
    );
  }
}

