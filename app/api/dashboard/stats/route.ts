import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, services, staff, clients, businesses } from '@/db/schema/business';
import { eq, and, gte, lte, count, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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

    // Get user's business
    const userBusinesses = await db
      .select()
      .from(businesses)
      .where(eq(businesses.ownerId, session.user.id))
      .limit(1);

    if (userBusinesses.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          todayBookingsCount: 0,
          todayRevenue: 0,
          totalClients: 0,
          confirmationRate: 0,
          todaySchedule: [],
          weeklyOverview: {
            totalBookings: 0,
            totalRevenue: 0,
            avgBookingValue: 0,
            activeStaff: 0,
          },
          upcomingBookings: [],
          weeklyPerformance: [],
        },
      });
    }

    const businessId = userBusinesses[0].id;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get this week's date range
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    // 1. Today's bookings count
    const todayBookingsResult = await db
      .select({ count: count() })
      .from(bookings)
      .where(
        and(
          eq(bookings.businessId, businessId),
          gte(bookings.startTime, today),
          lte(bookings.startTime, tomorrow)
        )
      );

    // 2. Today's revenue
    const todayRevenueResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${bookings.priceAtBooking}), 0)` })
      .from(bookings)
      .where(
        and(
          eq(bookings.businessId, businessId),
          gte(bookings.startTime, today),
          lte(bookings.startTime, tomorrow)
        )
      );

    // 3. Total clients
    const totalClientsResult = await db
      .select({ count: count() })
      .from(clients)
      .where(eq(clients.businessId, businessId));

    // 4. Confirmation rate
    const totalBookingsResult = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.businessId, businessId));

    const confirmedBookingsResult = await db
      .select({ count: count() })
      .from(bookings)
      .where(
        and(
          eq(bookings.businessId, businessId),
          eq(bookings.status, 'confirmed')
        )
      );

    const confirmationRate = totalBookingsResult[0].count > 0
      ? Math.round((confirmedBookingsResult[0].count / totalBookingsResult[0].count) * 100)
      : 0;

    // 5. Today's schedule with full details
    const todaySchedule = await db
      .select({
        id: bookings.id,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        status: bookings.status,
        price: bookings.priceAtBooking,
        notes: bookings.notes,
        client: {
          name: clients.name,
          email: clients.email,
          phone: clients.phone,
        },
        service: {
          name: services.name,
          duration: services.duration,
        },
        staff: {
          name: staff.name,
        },
      })
      .from(bookings)
      .leftJoin(clients, eq(bookings.clientId, clients.id))
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .leftJoin(staff, eq(bookings.staffId, staff.id))
      .where(
        and(
          eq(bookings.businessId, businessId),
          gte(bookings.startTime, today),
          lte(bookings.startTime, tomorrow)
        )
      )
      .orderBy(bookings.startTime);

    // 6. Weekly overview
    const weeklyBookingsResult = await db
      .select({ count: count() })
      .from(bookings)
      .where(
        and(
          eq(bookings.businessId, businessId),
          gte(bookings.startTime, weekStart),
          lte(bookings.startTime, weekEnd)
        )
      );

    const weeklyRevenueResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${bookings.priceAtBooking}), 0)` })
      .from(bookings)
      .where(
        and(
          eq(bookings.businessId, businessId),
          gte(bookings.startTime, weekStart),
          lte(bookings.startTime, weekEnd)
        )
      );

    const activeStaffResult = await db
      .select({ count: count() })
      .from(staff)
      .where(eq(staff.businessId, businessId));

    const avgBookingValue = weeklyBookingsResult[0].count > 0
      ? Math.round(Number(weeklyRevenueResult[0].total) / weeklyBookingsResult[0].count)
      : 0;

    // 7. Upcoming bookings (next 3 days, excluding today)
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(tomorrow.getDate() + 3);

    const upcomingBookings = await db
      .select({
        id: bookings.id,
        startTime: bookings.startTime,
        status: bookings.status,
        client: {
          name: clients.name,
        },
        service: {
          name: services.name,
        },
      })
      .from(bookings)
      .leftJoin(clients, eq(bookings.clientId, clients.id))
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(
        and(
          eq(bookings.businessId, businessId),
          gte(bookings.startTime, tomorrow),
          lte(bookings.startTime, dayAfterTomorrow)
        )
      )
      .orderBy(bookings.startTime)
      .limit(5);

    // 8. Weekly performance (last 7 days)
    const weeklyPerformance = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(today);
      dayStart.setDate(today.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const dayBookings = await db
        .select({ count: count() })
        .from(bookings)
        .where(
          and(
            eq(bookings.businessId, businessId),
            gte(bookings.startTime, dayStart),
            lte(bookings.startTime, dayEnd)
          )
        );

      const dayRevenue = await db
        .select({ total: sql<number>`COALESCE(SUM(${bookings.priceAtBooking}), 0)` })
        .from(bookings)
        .where(
          and(
            eq(bookings.businessId, businessId),
            gte(bookings.startTime, dayStart),
            lte(bookings.startTime, dayEnd)
          )
        );

      const dayNames = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
      weeklyPerformance.push({
        day: dayNames[dayStart.getDay()],
        bookings: dayBookings[0].count,
        revenue: Math.round(Number(dayRevenue[0].total) / 100), // Convert from cents to RON
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        todayBookingsCount: todayBookingsResult[0].count,
        todayRevenue: Math.round(Number(todayRevenueResult[0].total) / 100), // Convert from cents to RON
        totalClients: totalClientsResult[0].count,
        confirmationRate,
        todaySchedule: todaySchedule.map(booking => ({
          id: booking.id,
          time: booking.startTime.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
          client: booking.client?.name || 'Unknown',
          service: booking.service?.name || 'Unknown',
          staff: booking.staff?.name || 'Unassigned',
          price: Math.round(booking.price / 100), // Convert from cents to RON
          status: booking.status,
        })),
        weeklyOverview: {
          totalBookings: weeklyBookingsResult[0].count,
          totalRevenue: Math.round(Number(weeklyRevenueResult[0].total) / 100),
          avgBookingValue: Math.round(avgBookingValue / 100),
          activeStaff: activeStaffResult[0].count,
        },
        upcomingBookings: upcomingBookings.map(booking => ({
          id: booking.id,
          client: booking.client?.name || 'Unknown',
          service: booking.service?.name || 'Unknown',
          date: booking.startTime.toLocaleDateString('ro-RO', { month: 'short', day: 'numeric' }),
          time: booking.startTime.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
          status: booking.status,
        })),
        weeklyPerformance,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}



