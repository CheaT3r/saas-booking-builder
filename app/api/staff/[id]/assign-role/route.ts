import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { staff } from '@/db/schema/business';
import { userRoles } from '@/db/schema/admin';
import { user } from '@/db/schema/auth';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ROLES, ROLE_PERMISSIONS } from '@/lib/permissions';
import { checkIsBusinessOwner } from '@/lib/check-permissions';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST - Assign business_employee role to a staff member
 * Links a staff record to a user account and grants business access
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: staffId } = await params;
    const body = await request.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'User email is required' },
        { status: 400 }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get staff member details
    const staffMember = await db
      .select()
      .from(staff)
      .where(eq(staff.id, staffId))
      .limit(1);

    if (staffMember.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    const businessId = staffMember[0].businessId;

    // Check if user is the business owner
    const ownerCheck = await checkIsBusinessOwner(businessId);
    if (!ownerCheck.authorized) {
      return NextResponse.json(
        { success: false, error: 'Only business owners can assign roles to staff' },
        { status: 403 }
      );
    }

    // Find the user by email
    const targetUser = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .limit(1);

    if (targetUser.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found with this email. User must register first.' },
        { status: 404 }
      );
    }

    const targetUserId = targetUser[0].id;

    // Check if user already has a role for this business
    const existingRole = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, targetUserId),
          eq(userRoles.businessId, businessId)
        )
      )
      .limit(1);

    if (existingRole.length > 0) {
      return NextResponse.json(
        { success: false, error: 'User already has a role in this business' },
        { status: 400 }
      );
    }

    // Create business_employee role for the user
    const newRole = await db
      .insert(userRoles)
      .values({
        userId: targetUserId,
        businessId: businessId,
        role: ROLES.BUSINESS_EMPLOYEE,
        permissions: ROLE_PERMISSIONS[ROLES.BUSINESS_EMPLOYEE],
      })
      .returning();

    // Update staff record to link to user
    await db
      .update(staff)
      .set({
        userId: targetUserId,
        email: userEmail,
      })
      .where(eq(staff.id, staffId));

    return NextResponse.json({
      success: true,
      message: 'Staff member assigned business employee role successfully',
      data: {
        role: newRole[0],
        staffMember: staffMember[0],
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error assigning role to staff:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign role' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove business_employee role from a staff member
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: staffId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get staff member details
    const staffMember = await db
      .select()
      .from(staff)
      .where(eq(staff.id, staffId))
      .limit(1);

    if (staffMember.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    const businessId = staffMember[0].businessId;
    const targetUserId = staffMember[0].userId;

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Staff member has no user account linked' },
        { status: 400 }
      );
    }

    // Check if user is the business owner
    const ownerCheck = await checkIsBusinessOwner(businessId);
    if (!ownerCheck.authorized) {
      return NextResponse.json(
        { success: false, error: 'Only business owners can remove staff roles' },
        { status: 403 }
      );
    }

    // Remove the business_employee role
    await db
      .delete(userRoles)
      .where(
        and(
          eq(userRoles.userId, targetUserId),
          eq(userRoles.businessId, businessId),
          eq(userRoles.role, ROLES.BUSINESS_EMPLOYEE)
        )
      );

    // Unlink user from staff record
    await db
      .update(staff)
      .set({
        userId: null,
      })
      .where(eq(staff.id, staffId));

    return NextResponse.json({
      success: true,
      message: 'Staff member role removed successfully',
    });
  } catch (error) {
    console.error('Error removing staff role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove role' },
      { status: 500 }
    );
  }
}



