import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businesses } from '@/db/schema/business';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - Get business settings
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
      return NextResponse.json(
        { success: false, error: 'No business found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: userBusinesses[0],
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update business settings
export async function PUT(request: NextRequest) {
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
        primaryColor: body.primaryColor || '#3b82f6',
        accentColor: body.accentColor || '#8b5cf6',
        workingHours: body.workingHours || null,
        updatedAt: new Date(),
      })
      .where(eq(businesses.id, businessId))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedBusiness[0],
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}



