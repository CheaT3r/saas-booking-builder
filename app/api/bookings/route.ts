import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, services, staff, clients, businesses } from '@/db/schema/business';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - List all bookings for user's business
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
        data: [],
      });
    }

    const businessId = userBusinesses[0].id;

    // Get all bookings with related data
    const allBookings = await db
      .select({
        id: bookings.id,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        status: bookings.status,
        price: bookings.priceAtBooking,
        notes: bookings.notes,
        createdAt: bookings.createdAt,
        client: {
          id: clients.id,
          name: clients.name,
          email: clients.email,
          phone: clients.phone,
        },
        service: {
          id: services.id,
          name: services.name,
          duration: services.duration,
          category: services.category,
        },
        staff: {
          id: staff.id,
          name: staff.name,
        },
      })
      .from(bookings)
      .leftJoin(clients, eq(bookings.clientId, clients.id))
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .leftJoin(staff, eq(bookings.staffId, staff.id))
      .where(eq(bookings.businessId, businessId))
      .orderBy(desc(bookings.startTime));

    return NextResponse.json({
      success: true,
      data: allBookings.map(booking => ({
        id: booking.id,
        date: booking.startTime.toISOString().split('T')[0],
        time: booking.startTime.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
        startTime: booking.startTime,
        endTime: booking.endTime,
        client: booking.client?.name || 'Unknown',
        clientEmail: booking.client?.email,
        clientPhone: booking.client?.phone,
        service: booking.service?.name || 'Unknown',
        serviceCategory: booking.service?.category,
        serviceDuration: booking.service?.duration,
        staff: booking.staff?.name || 'Unassigned',
        price: Math.round(booking.price / 100), // Convert from cents to RON
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Get user's business
    const userBusinesses = await db
      .select()
      .from(businesses)
      .where(eq(businesses.ownerId, session.user.id))
      .limit(1);

    if (userBusinesses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No business found' },
        { status: 404 }
      );
    }

    const businessId = userBusinesses[0].id;

    // Create booking
    const newBooking = await db.insert(bookings).values({
      businessId: businessId,
      clientId: body.clientId,
      serviceId: body.serviceId,
      staffId: body.staffId || null,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      status: body.status || 'pending',
      notes: body.notes || null,
      priceAtBooking: body.price * 100, // Convert RON to cents
    }).returning();

    return NextResponse.json({
      success: true,
      data: newBooking[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
