import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businesses } from '@/db/schema/business';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// POST - Create initial business for new user
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
    const { businessName, industry } = body;

    // Check if user already has a business
    const existingBusinesses = await db
      .select()
      .from(businesses)
      .where(eq(businesses.ownerId, session.user.id))
      .limit(1);

    if (existingBusinesses.length > 0) {
      return NextResponse.json({
        success: true,
        data: existingBusinesses[0],
        message: 'Business already exists',
      });
    }

    // Generate slug from business name
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Math.random().toString(36).substring(2, 7);

    // Create business
    const newBusiness = await db
      .insert(businesses)
      .values({
        ownerId: session.user.id,
        name: businessName,
        slug: slug,
        tagline: industry || null,
        description: `Welcome to ${businessName}! We're excited to serve you.`,
        primaryColor: '#3b82f6',
        accentColor: '#8b5cf6',
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
      message: 'Business created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create business' },
      { status: 500 }
    );
  }
}

