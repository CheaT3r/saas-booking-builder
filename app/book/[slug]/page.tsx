import { notFound } from 'next/navigation';
import { db } from '@/db';
import { businesses, services, staff } from '@/db/schema/business';
import { eq } from 'drizzle-orm';
import BookingPageClient from './page.client';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch business data by slug
  const businessData = await db
    .select()
    .from(businesses)
    .where(eq(businesses.slug, slug))
    .limit(1);

  if (businessData.length === 0) {
    notFound();
  }

  const business = businessData[0];

  // Fetch services for this business
  const businessServices = await db
    .select()
    .from(services)
    .where(eq(services.businessId, business.id));

  // Fetch staff for this business
  const businessStaff = await db
    .select()
    .from(staff)
    .where(eq(staff.businessId, business.id));

  return (
    <BookingPageClient
      business={business}
      services={businessServices}
      staff={businessStaff}
    />
  );
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const businessData = await db
    .select()
    .from(businesses)
    .where(eq(businesses.slug, slug))
    .limit(1);

  if (businessData.length === 0) {
    return {
      title: 'Business Not Found',
    };
  }

  const business = businessData[0];

  return {
    title: `${business.name} - Book Online | BIZNIZZ.EU`,
    description: business.description || `Book appointments online with ${business.name}. Fast, easy, and convenient.`,
  };
}
