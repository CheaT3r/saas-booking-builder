import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, businesses } from '@/db/schema/business';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - Get a single booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const booking = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.id, params.id),
          eq(bookings.businessId, userBusinesses[0].id)
        )
      );
    
    if (booking.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking[0],
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PUT - Update a booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updatedBooking = await db
      .update(bookings)
      .set({
        clientId: body.clientId,
        serviceId: body.serviceId,
        staffId: body.staffId || null,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        status: body.status,
        notes: body.notes,
        priceAtBooking: body.price ? body.price * 100 : undefined,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(bookings.id, params.id),
          eq(bookings.businessId, userBusinesses[0].id)
        )
      )
      .returning();

    if (updatedBooking.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking[0],
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const deletedBooking = await db
      .delete(bookings)
      .where(
        and(
          eq(bookings.id, params.id),
          eq(bookings.businessId, userBusinesses[0].id)
        )
      )
      .returning();

    if (deletedBooking.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
