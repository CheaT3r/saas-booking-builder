import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { businesses, subscriptions } from '@/db/schema/business';
import { eq, sql, desc } from 'drizzle-orm';
import { checkIsSuperAdmin } from '@/lib/check-admin';

// GET - List all users with their business and subscription info
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const users = await db
      .select({
        user: user,
        business: businesses,
        subscription: subscriptions,
      })
      .from(user)
      .leftJoin(businesses, eq(businesses.ownerId, user.id))
      .leftJoin(subscriptions, sql`${subscriptions.businessId} = ${businesses.id} AND ${subscriptions.status} = 'active'`)
      .orderBy(user.createdAt);

    // Remove duplicates - keep only first occurrence of each user
    const uniqueUsers = users.reduce((acc: typeof users, current) => {
      const existing = acc.find(item => item.user.id === current.user.id);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof users);

    return NextResponse.json({
      success: true,
      data: uniqueUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

