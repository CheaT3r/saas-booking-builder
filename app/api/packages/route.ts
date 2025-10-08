import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { packages } from '@/db/schema/admin';
import { eq } from 'drizzle-orm';

// GET - List all active packages (public endpoint for business owners to see available packages)
export async function GET(request: NextRequest) {
  try {
    // Only return active packages
    const activePackages = await db
      .select()
      .from(packages)
      .where(eq(packages.isActive, true));
    
    return NextResponse.json({
      success: true,
      data: activePackages,
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

