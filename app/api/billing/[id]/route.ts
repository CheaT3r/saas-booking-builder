import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { subscriptions } from '@/db/schema/business';
import { eq } from 'drizzle-orm';

// PUT - Update subscription
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: {
      updatedAt: Date;
      status?: string;
      billingCycle?: string;
      amount?: number;
      nextBillingDate?: Date;
      endDate?: Date;
    } = {
      updatedAt: new Date(),
    };

    if (body.status) updateData.status = body.status;
    if (body.billingCycle) updateData.billingCycle = body.billingCycle;
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.nextBillingDate) updateData.nextBillingDate = new Date(body.nextBillingDate);
    if (body.endDate) updateData.endDate = new Date(body.endDate);

    const updatedSubscription = await db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, id))
      .returning();

    if (updatedSubscription.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSubscription[0],
    });
  } catch (error) {
    console.error(`Error updating subscription:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel subscription
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Soft delete: update status to cancelled and set end date
    const updatedSubscription = await db
      .update(subscriptions)
      .set({
        status: 'cancelled',
        endDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, id))
      .returning();

    if (updatedSubscription.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSubscription[0],
    });
  } catch (error) {
    console.error(`Error cancelling subscription:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}



