import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clients, businesses, bookings } from '@/db/schema/business';
import { eq, desc, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - List all clients for user's business with booking count
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

    // Get clients with booking count
    const allClients = await db
      .select({
        id: clients.id,
        name: clients.name,
        email: clients.email,
        phone: clients.phone,
        notes: clients.notes,
        createdAt: clients.createdAt,
        bookingsCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${bookings} 
          WHERE ${bookings.clientId} = ${clients.id}
        )`,
      })
      .from(clients)
      .where(eq(clients.businessId, businessId))
      .orderBy(desc(clients.createdAt));

    return NextResponse.json({
      success: true,
      data: allClients,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST - Create a new client
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

    const newClient = await db.insert(clients).values({
      businessId: businessId,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      notes: body.notes || null,
    }).returning();

    return NextResponse.json({
      success: true,
      data: { ...newClient[0], bookingsCount: 0 },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
