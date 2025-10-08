import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { services, businesses } from '@/db/schema/business';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - Get a single service by ID
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

    const service = await db
      .select()
      .from(services)
      .where(
        and(
          eq(services.id, params.id),
          eq(services.businessId, userBusinesses[0].id)
        )
      );
    
    if (service.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...service[0],
        price: Math.round(service[0].price / 100),
      },
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// PUT - Update a service
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

    const updatedService = await db
      .update(services)
      .set({
        name: body.name,
        description: body.description || null,
        duration: body.duration,
        price: body.price ? body.price * 100 : undefined,
        category: body.category || null,
        imageUrl: body.imageUrl || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(services.id, params.id),
          eq(services.businessId, userBusinesses[0].id)
        )
      )
      .returning();

    if (updatedService.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedService[0],
        price: Math.round(updatedService[0].price / 100),
      },
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a service
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

    const deletedService = await db
      .delete(services)
      .where(
        and(
          eq(services.id, params.id),
          eq(services.businessId, userBusinesses[0].id)
        )
      )
      .returning();

    if (deletedService.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
