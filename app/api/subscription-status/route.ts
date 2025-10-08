import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { subscriptions } from '@/db/schema/business';
import { eq, and } from 'drizzle-orm';

// GET - Check if business has active subscription
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

    // Check for active subscription
    const activeSub = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.businessId, businessId),
          eq(subscriptions.status, 'active')
        )
      )
      .limit(1);

    const hasActiveSubscription = activeSub.length > 0;

    return NextResponse.json({
      success: true,
      data: {
        hasActiveSubscription,
        subscription: activeSub[0] || null,
      },
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}



