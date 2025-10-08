import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businesses } from '@/db/schema/business';
import { eq } from 'drizzle-orm';
import { checkIsSuperAdmin } from '@/lib/check-admin';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Get a specific business (Admin)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const { id } = await params;

    const business = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
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

// PUT - Update a business (Admin)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updatedBusiness = await db
      .update(businesses)
      .set({
        name: body.name,
        slug: body.slug,
        tagline: body.industry || null,
        description: body.description || null,
        email: body.contactEmail || null,
        phone: body.contactPhone || null,
        address: body.address || null,
        updatedAt: new Date(),
      })
      .where(eq(businesses.id, id))
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

// DELETE - Delete a business (Admin)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const { id } = await params;

    const deletedBusiness = await db
      .delete(businesses)
      .where(eq(businesses.id, id))
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
