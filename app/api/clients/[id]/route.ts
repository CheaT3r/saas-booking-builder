import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clients, businesses } from '@/db/schema/business';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// PUT - Update a client
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

    const updatedClient = await db
      .update(clients)
      .set({
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        notes: body.notes || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(clients.id, params.id),
          eq(clients.businessId, userBusinesses[0].id)
        )
      )
      .returning();

    if (updatedClient.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedClient[0],
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a client
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

    const deletedClient = await db
      .delete(clients)
      .where(
        and(
          eq(clients.id, params.id),
          eq(clients.businessId, userBusinesses[0].id)
        )
      )
      .returning();

    if (deletedClient.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
