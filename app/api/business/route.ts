import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businesses } from '@/db/schema/business';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - List all businesses for the authenticated user
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
      .where(eq(businesses.ownerId, session.user.id));

    return NextResponse.json({
      success: true,
      data: userBusinesses,
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}

// POST - Create a new business
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

    // Generate slug from business name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Math.random().toString(36).substring(2, 7);

    const newBusiness = await db
      .insert(businesses)
      .values({
        ownerId: session.user.id,
        name: body.name,
        slug: slug,
        tagline: body.tagline || null,
        description: body.description || null,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        website: body.website || null,
        primaryColor: body.primaryColor || '#3b82f6',
        accentColor: body.accentColor || '#8b5cf6',
        workingHours: {
          monday: { open: '09:00', close: '18:00', closed: false },
          tuesday: { open: '09:00', close: '18:00', closed: false },
          wednesday: { open: '09:00', close: '18:00', closed: false },
          thursday: { open: '09:00', close: '18:00', closed: false },
          friday: { open: '09:00', close: '18:00', closed: false },
          saturday: { open: '10:00', close: '16:00', closed: false },
          sunday: { open: '', close: '', closed: true },
        },
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newBusiness[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create business' },
      { status: 500 }
    );
  }
}



