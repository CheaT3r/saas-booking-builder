import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businesses, bookings, subscriptions } from '@/db/schema/business';
import { sql } from 'drizzle-orm';
import { checkIsSuperAdmin } from '@/lib/check-admin';

// GET - Platform analytics
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }

    // Total businesses
    const totalBusinesses = await db.select({ count: sql<number>`count(*)::int` }).from(businesses);
    
    // Total bookings
    const totalBookings = await db.select({ count: sql<number>`count(*)::int` }).from(bookings);
    
    // Total revenue (from bookings)
    const revenueResult = await db.select({ 
      total: sql<number>`COALESCE(SUM(price_at_booking), 0)::int` 
    }).from(bookings);
    
    // Active subscriptions (if table exists)
    let activeSubscriptions = 0;
    try {
      const subsResult = await db.select({ count: sql<number>`count(*)::int` })
        .from(subscriptions)
        .where(sql`status = 'active'`);
      activeSubscriptions = subsResult[0]?.count || 0;
    } catch (e) {
      // Subscriptions table might not exist yet
    }

    // Bookings by status
    const bookingsByStatus = await db.select({
      status: bookings.status,
      count: sql<number>`count(*)::int`
    })
    .from(bookings)
    .groupBy(bookings.status);

    // Recent bookings trend (last 7 days)
    const weeklyBookings = await db.select({
      date: sql<string>`DATE(start_time)`,
      count: sql<number>`count(*)::int`
    })
    .from(bookings)
    .where(sql`start_time >= NOW() - INTERVAL '7 days'`)
    .groupBy(sql`DATE(start_time)`)
    .orderBy(sql`DATE(start_time)`);

    return NextResponse.json({
      success: true,
      data: {
        totalBusinesses: totalBusinesses[0]?.count || 0,
        totalBookings: totalBookings[0]?.count || 0,
        totalRevenue: revenueResult[0]?.total || 0,
        activeSubscriptions,
        bookingsByStatus,
        weeklyBookings,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

