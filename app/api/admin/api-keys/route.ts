import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeys } from '@/db/schema/admin';
import { checkIsSuperAdmin } from '@/lib/check-admin';

// GET - List all API keys
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const allApiKeys = await db.select().from(apiKeys);
    
    return NextResponse.json({
      success: true,
      data: allApiKeys,
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkIsSuperAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const body = await request.json();
    
    const newApiKey = await db.insert(apiKeys).values({
      name: body.name,
      key: body.key,
      provider: body.provider,
      environment: body.environment,
      isActive: body.isActive ?? true,
    }).returning();

    return NextResponse.json({
      success: true,
      data: newApiKey[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

