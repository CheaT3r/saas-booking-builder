import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businesses } from '@/db/schema/business';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Get a specific business
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const business = await db
      .select()
      .from(businesses)
      .where(and(eq(businesses.id, id), eq(businesses.ownerId, session.user.id)))
      .limit(1);

    if (business.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: business[0],
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch business' },
      { status: 500 }
    );
  }
}

// PUT - Update a business
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    const updatedBusiness = await db
      .update(businesses)
      .set({
        name: body.name,
        tagline: body.tagline || null,
        description: body.description || null,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        website: body.website || null,
        primaryColor: body.primaryColor,
        accentColor: body.accentColor,
        updatedAt: new Date(),
      })
      .where(and(eq(businesses.id, id), eq(businesses.ownerId, session.user.id)))
      .returning();

    if (updatedBusiness.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBusiness[0],
    });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update business' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a business
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const deletedBusiness = await db
      .delete(businesses)
      .where(and(eq(businesses.id, id), eq(businesses.ownerId, session.user.id)))
      .returning();

    if (deletedBusiness.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedBusiness[0],
    });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete business' },
      { status: 500 }
    );
  }
}



