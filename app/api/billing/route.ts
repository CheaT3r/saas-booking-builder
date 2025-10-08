import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { subscriptions, businesses } from '@/db/schema/business';
import { packages } from '@/db/schema/admin';
import { eq } from 'drizzle-orm';

// GET - List subscriptions for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Fetch subscriptions with joined package data
    const subs = await db
      .select({
        subscription: subscriptions,
        package: packages,
        business: businesses,
      })
      .from(subscriptions)
      .leftJoin(packages, eq(subscriptions.packageId, packages.id))
      .leftJoin(businesses, eq(subscriptions.businessId, businesses.id))
      .where(eq(subscriptions.businessId, businessId));

    return NextResponse.json({
      success: true,
      data: subs.map(item => ({
        ...item.subscription,
        packageName: item.package?.name || 'Custom',
        businessName: item.business?.name || 'Unknown',
      })),
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

// POST - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newSubscription = await db.insert(subscriptions).values({
      businessId: body.businessId,
      packageId: body.packageId || null,
      status: body.status || 'active',
      billingCycle: body.billingCycle || 'monthly',
      amount: body.amount,
      startDate: new Date(body.startDate),
      nextBillingDate: body.nextBillingDate ? new Date(body.nextBillingDate) : null,
    }).returning();

    return NextResponse.json({
      success: true,
      data: newSubscription[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}



