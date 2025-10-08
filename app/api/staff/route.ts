import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { staff, businesses } from '@/db/schema/business';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - List all staff for user's business
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

    const allStaff = await db
      .select()
      .from(staff)
      .where(eq(staff.businessId, businessId))
      .orderBy(desc(staff.createdAt));

    return NextResponse.json({
      success: true,
      data: allStaff,
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

// POST - Create a new staff member
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

    const newStaff = await db.insert(staff).values({
      businessId: businessId,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      specialty: body.specialty || null,
      bio: body.bio || null,
      avatarUrl: body.avatarUrl || null,
      workingHours: body.workingHours || null,
    }).returning();

    return NextResponse.json({
      success: true,
      data: newStaff[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create staff' },
      { status: 500 }
    );
  }
}
