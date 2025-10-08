import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { services, businesses } from '@/db/schema/business';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - List all services for user's business
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

    // Get user's business
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

    // Get all services
    const allServices = await db
      .select()
      .from(services)
      .where(eq(services.businessId, businessId))
      .orderBy(desc(services.createdAt));

    return NextResponse.json({
      success: true,
      data: allServices.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: Math.round(service.price / 100), // Convert from cents to RON
        category: service.category,
        imageUrl: service.imageUrl,
        createdAt: service.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST - Create a new service
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

    // Get user's business
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

    // Create service
    const newService = await db.insert(services).values({
      businessId: businessId,
      name: body.name,
      description: body.description || null,
      duration: body.duration,
      price: body.price * 100, // Convert RON to cents
      category: body.category || null,
      imageUrl: body.imageUrl || null,
    }).returning();

    return NextResponse.json({
      success: true,
      data: {
        ...newService[0],
        price: Math.round(newService[0].price / 100),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
