import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businesses } from '@/db/schema/business';
import { user } from '@/db/schema/auth';
import { subscriptions } from '@/db/schema/business';
import { eq, sql } from 'drizzle-orm';
import { checkIsSuperAdmin } from '@/lib/check-admin';

// GET - List all businesses (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if user is super admin
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const allBusinesses = await db
      .select({
        business: businesses,
        owner: user,
        subscription: subscriptions,
      })
      .from(businesses)
      .leftJoin(user, eq(businesses.ownerId, user.id))
      .leftJoin(subscriptions, sql`${subscriptions.businessId} = ${businesses.id} AND ${subscriptions.status} = 'active'`)
      .orderBy(businesses.createdAt);

    // Remove duplicates
    const uniqueBusinesses = allBusinesses.reduce((acc: typeof allBusinesses, current) => {
      const existing = acc.find(item => item.business.id === current.business.id);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof allBusinesses);

    // Map to simpler format
    const formattedBusinesses = uniqueBusinesses.map(item => ({
      ...item.business,
      ownerName: item.owner?.name || 'Unknown',
      ownerEmail: item.owner?.email || 'Unknown',
      hasActiveSubscription: !!item.subscription,
    }));

    return NextResponse.json({
      success: true,
      data: formattedBusinesses,
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}

// POST - Create a business (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is super admin
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const body = await request.json();

    // Generate slug
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Math.random().toString(36).substring(2, 7);

    const newBusiness = await db
      .insert(businesses)
      .values({
        ownerId: body.ownerId || 'admin', // You'd get this from the request
        name: body.name,
        slug: slug,
        tagline: body.industry || null,
        description: body.description || null,
        email: body.contactEmail || null,
        phone: body.contactPhone || null,
        address: body.address || null,
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
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create business' },
      { status: 500 }
    );
  }
}
