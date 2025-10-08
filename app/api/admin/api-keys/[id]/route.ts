import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeys } from '@/db/schema/admin';
import { eq } from 'drizzle-orm';

// GET - Get a single API key by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiKey = await db.select().from(apiKeys).where(eq(apiKeys.id, params.id));
    
    if (apiKey.length === 0) {
      return NextResponse.json(
        { success: false, error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: apiKey[0],
    });
  } catch (error) {
    console.error('Error fetching API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}

// PUT - Update an API key
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedApiKey = await db
      .update(apiKeys)
      .set({
        name: body.name,
        key: body.key,
        provider: body.provider,
        environment: body.environment,
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(apiKeys.id, params.id))
      .returning();

    if (updatedApiKey.length === 0) {
      return NextResponse.json(
        { success: false, error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedApiKey[0],
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedApiKey = await db
      .delete(apiKeys)
      .where(eq(apiKeys.id, params.id))
      .returning();

    if (deletedApiKey.length === 0) {
      return NextResponse.json(
        { success: false, error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}



