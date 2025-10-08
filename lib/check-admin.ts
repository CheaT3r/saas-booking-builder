import { db } from '@/db';
import { userRoles } from '@/db/schema/admin';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function checkIsSuperAdmin() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { authorized: false, error: 'Unauthorized' };
    }

    // Check if user has super_admin role
    const userRole = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, session.user.id))
      .limit(1);

    const role = userRole.length > 0 ? userRole[0].role : 'business_owner';

    if (role !== 'super_admin') {
      return { authorized: false, error: 'Forbidden - Super Admin access required' };
    }

    return { authorized: true, userId: session.user.id };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { authorized: false, error: 'Internal server error' };
  }
}



