import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { packages } from '@/db/schema/admin';
import { eq } from 'drizzle-orm';

// GET - Get a single package by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: packageId } = await params;
    const pkg = await db.select().from(packages).where(eq(packages.id, packageId));
    
    if (pkg.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pkg[0],
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch package' },
      { status: 500 }
    );
  }
}

// PUT - Update a package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: packageId } = await params;
    const body = await request.json();
    
    const updatedPackage = await db
      .update(packages)
      .set({
        name: body.name,
        description: body.description,
        priceMonthly: body.priceMonthly,
        priceAnnually: body.priceAnnually,
        features: body.features,
        maxUsers: body.maxUsers,
        maxBookings: body.maxBookings,
        apiAccess: body.apiAccess,
        customBranding: body.customBranding,
        prioritySupport: body.prioritySupport,
        updatedAt: new Date(),
      })
      .where(eq(packages.id, packageId))
      .returning();

    if (updatedPackage.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPackage[0],
    });
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update package' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: packageId } = await params;
    const deletedPackage = await db
      .delete(packages)
      .where(eq(packages.id, packageId))
      .returning();

    if (deletedPackage.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete package' },
      { status: 500 }
    );
  }
}



