import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { packages } from '@/db/schema/admin';
import { checkIsSuperAdmin } from '@/lib/check-admin';

// GET - List all packages
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const allPackages = await db.select().from(packages);
    
    return NextResponse.json({
      success: true,
      data: allPackages,
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

// POST - Create a new package
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const body = await request.json();
    
    const newPackage = await db.insert(packages).values({
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
    }).returning();

    return NextResponse.json({
      success: true,
      data: newPackage[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create package' },
      { status: 500 }
    );
  }
}

