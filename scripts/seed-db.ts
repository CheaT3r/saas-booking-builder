import 'dotenv/config';
import { db } from '../db';
import { packages, businesses, services, staff, clients, bookings } from '../db/schema/business';
import { user as authUser } from '../db/schema/auth';
import { userRoles, apiKeys } from '../db/schema/admin';

async function main() {
  console.log('🌱 Seeding database...\n');

  try {
    // 1. Create packages
    console.log('📦 Creating packages...');
    const [starterPackage, professionalPackage, enterprisePackage] = await db.insert(packages).values([
      {
        name: 'Starter',
        description: 'Perfect pentru început - ideal pentru business-uri mici',
        priceMonthly: 4900, // 49 RON
        priceAnnually: 49000, // 490 RON (economie ~16%)
        features: ['100 programări/lună', 'Email notifications', 'Dashboard basic', 'Suport standard'],
        maxUsers: 1,
        maxBookings: 100,
        apiAccess: false,
        customBranding: false,
        prioritySupport: false,
      },
      {
        name: 'Professional',
        description: 'Pentru business-uri în creștere cu nevoi avansate',
        priceMonthly: 14900, // 149 RON
        priceAnnually: 149000, // 1490 RON
        features: ['Programări nelimitate', 'Email & SMS notifications', 'Dashboard avansat', 'Rapoarte detaliate', 'Suport prioritar', '5 utilizatori'],
        maxUsers: 5,
        maxBookings: null, // unlimited
        apiAccess: false,
        customBranding: true,
        prioritySupport: true,
      },
      {
        name: 'Enterprise',
        description: 'Pentru companii mari cu cerințe complexe',
        priceMonthly: 49900, // 499 RON
        priceAnnually: 499000, // 4990 RON
        features: ['Totul din Professional', 'API Access', 'Custom branding complet', 'Utilizatori nelimitați', 'Suport dedicat 24/7', 'Manager de cont dedicat'],
        maxUsers: null, // unlimited
        maxBookings: null, // unlimited
        apiAccess: true,
        customBranding: true,
        prioritySupport: true,
      },
    ]).returning();
    console.log('✅ Packages created!\n');

    // 2. Get existing user (vlogulubradu@gmail.com) or create demo user
    console.log('👤 Setting up user roles...');
    const existingUsers = await db.select().from(authUser).limit(1);
    
    if (existingUsers.length > 0) {
      const userId = existingUsers[0].id;
      
      // Set user as super admin
      await db.insert(userRoles).values({
        userId: userId,
        role: 'super_admin',
        permissions: ['*'], // All permissions
      }).onConflictDoNothing();
      
      console.log(`✅ User ${existingUsers[0].email} set as super admin!\n`);
      
      // 3. Create demo businesses
      console.log('🏢 Creating demo businesses...');
      const [salon, dental, barber] = await db.insert(businesses).values([
        {
          ownerId: userId,
          name: 'Premium Salon & Spa',
          slug: 'premium-salon-spa',
          tagline: 'Your Beauty, Our Passion',
          description: 'Salon premium cu servicii complete de înfrumusețare și relaxare. Echipă de profesioniști cu experiență de peste 10 ani.',
          address: 'Str. Victoriei 123, București',
          phone: '+40 721 123 456',
          email: 'contact@premium-salon.ro',
          website: 'https://premium-salon.ro',
          primaryColor: '#ec4899',
          accentColor: '#8b5cf6',
        },
        {
          ownerId: userId,
          name: 'Dental Clinic Pro',
          slug: 'dental-clinic-pro',
          tagline: 'Healthy Smile, Happy Life',
          description: 'Clinică stomatologică modernă cu echipamente de ultimă generație și medici specializați.',
          address: 'Bd. Unirii 45, București',
          phone: '+40 722 234 567',
          email: 'contact@dental-pro.ro',
          website: 'https://dental-pro.ro',
          primaryColor: '#3b82f6',
          accentColor: '#06b6d4',
        },
        {
          ownerId: userId,
          name: 'Barbershop Classic',
          slug: 'barbershop-classic',
          tagline: 'Traditional Cuts, Modern Style',
          description: 'Frizerie clasică pentru bărbați cu atmosferă vintage și servicii premium.',
          address: 'Str. Lipscani 78, București',
          phone: '+40 723 345 678',
          email: 'contact@barbershop-classic.ro',
          website: 'https://barbershop-classic.ro',
          primaryColor: '#f97316',
          accentColor: '#ef4444',
        },
      ]).returning();
      console.log('✅ Businesses created!\n');

      // 4. Create services for each business
      console.log('💇 Creating services...');
      await db.insert(services).values([
        // Salon services
        { businessId: salon.id, name: 'Tuns & Styling', description: 'Tuns profesional și styling complet', duration: 60, price: 15000, category: 'Hair' },
        { businessId: salon.id, name: 'Vopsit Păr', description: 'Vopsit profesional cu produse premium', duration: 120, price: 25000, category: 'Hair' },
        { businessId: salon.id, name: 'Manichiură', description: 'Manichiură completă cu ojă gel', duration: 45, price: 8000, category: 'Nails' },
        { businessId: salon.id, name: 'Pedichiură', description: 'Pedichiură completă cu ojă gel', duration: 60, price: 10000, category: 'Nails' },
        { businessId: salon.id, name: 'Masaj Terapeutic', description: 'Masaj relaxant 60 minute', duration: 60, price: 28000, category: 'Wellness' },
        
        // Dental services
        { businessId: dental.id, name: 'Consultație Dentară', description: 'Consultație completă cu plan de tratament', duration: 30, price: 10000, category: 'Consultation' },
        { businessId: dental.id, name: 'Detartraj', description: 'Curățare profesională și detartraj', duration: 45, price: 20000, category: 'Cleaning' },
        { businessId: dental.id, name: 'Plombă', description: 'Plombă estetică cu materiale premium', duration: 60, price: 30000, category: 'Treatment' },
        { businessId: dental.id, name: 'Albire Dentară', description: 'Albire profesională cu laser', duration: 90, price: 150000, category: 'Cosmetic' },
        
        // Barber services
        { businessId: barber.id, name: 'Tuns Clasic', description: 'Tuns clasic pentru bărbați', duration: 30, price: 6000, category: 'Hair' },
        { businessId: barber.id, name: 'Tuns & Barbă', description: 'Tuns complet plus aranjare barbă', duration: 45, price: 9000, category: 'Hair' },
        { businessId: barber.id, name: 'Aranjare Barbă', description: 'Conturare și aranjare profesională', duration: 20, price: 4000, category: 'Beard' },
      ]);
      console.log('✅ Services created!\n');

      // 5. Create staff
      console.log('👨‍💼 Creating staff members...');
      const [elena, andrei, laura, cristina, alex, george] = await db.insert(staff).values([
        // Salon staff
        { businessId: salon.id, name: 'Elena Georgescu', email: 'elena@premium-salon.ro', phone: '+40 721 111 111', specialty: 'Hair Stylist Senior', bio: 'Peste 15 ani experiență în styling și colorare.' },
        { businessId: salon.id, name: 'Andrei Mihai', email: 'andrei@premium-salon.ro', phone: '+40 721 222 222', specialty: 'Maseur Terapeut', bio: 'Specializat în masaj terapeutic și relaxare.' },
        { businessId: salon.id, name: 'Laura Vasile', email: 'laura@premium-salon.ro', phone: '+40 721 333 333', specialty: 'Nail Artist', bio: 'Expert în nail art și manichiură gel.' },
        { businessId: salon.id, name: 'Cristina Popescu', email: 'cristina@premium-salon.ro', phone: '+40 721 444 444', specialty: 'Beauty Specialist', bio: 'Specializată în tratamente faciale și corporale.' },
        
        // Dental staff
        { businessId: dental.id, name: 'Dr. Alex Ionescu', email: 'alex@dental-pro.ro', phone: '+40 722 111 111', specialty: 'Medic Stomatolog', bio: 'Rezident în stomatologie generală cu 10 ani experiență.' },
        
        // Barber staff
        { businessId: barber.id, name: 'George Stan', email: 'george@barbershop-classic.ro', phone: '+40 723 111 111', specialty: 'Master Barber', bio: 'Specialist în tunsorile clasice pentru bărbați.' },
      ]).returning();
      console.log('✅ Staff created!\n');

      // 6. Create clients
      console.log('👥 Creating clients...');
      const [client1, client2, client3, client4, client5] = await db.insert(clients).values([
        { businessId: salon.id, name: 'Maria Ionescu', email: 'maria.ionescu@email.com', phone: '+40 744 111 111' },
        { businessId: salon.id, name: 'Diana Popa', email: 'diana.popa@email.com', phone: '+40 744 222 222' },
        { businessId: dental.id, name: 'Ion Georgescu', email: 'ion.georgescu@email.com', phone: '+40 744 333 333' },
        { businessId: barber.id, name: 'Andrei Mihai', email: 'andrei.mihai@email.com', phone: '+40 744 444 444' },
        { businessId: salon.id, name: 'Laura Vasile', email: 'laura.vasile@email.com', phone: '+40 744 555 555' },
      ]).returning();
      console.log('✅ Clients created!\n');

      // 7. Create sample bookings
      console.log('📅 Creating bookings...');
      const salonServices = await db.select().from(services).where({ businessId: salon.id });
      const dentalServices = await db.select().from(services).where({ businessId: dental.id });
      const barberServices = await db.select().from(services).where({ businessId: barber.id });

      await db.insert(bookings).values([
        // Today's bookings
        {
          businessId: salon.id,
          clientId: client1.id,
          serviceId: salonServices[0].id,
          staffId: elena.id,
          startTime: new Date('2024-10-07T10:00:00'),
          endTime: new Date('2024-10-07T11:00:00'),
          status: 'confirmed',
          priceAtBooking: 15000,
        },
        {
          businessId: salon.id,
          clientId: client2.id,
          serviceId: salonServices[4].id,
          staffId: andrei.id,
          startTime: new Date('2024-10-07T11:30:00'),
          endTime: new Date('2024-10-07T12:30:00'),
          status: 'pending',
          priceAtBooking: 28000,
        },
        {
          businessId: dental.id,
          clientId: client3.id,
          serviceId: dentalServices[1].id,
          staffId: alex.id,
          startTime: new Date('2024-10-07T14:00:00'),
          endTime: new Date('2024-10-07T14:45:00'),
          status: 'confirmed',
          priceAtBooking: 20000,
        },
        // Future bookings
        {
          businessId: barber.id,
          clientId: client4.id,
          serviceId: barberServices[1].id,
          staffId: george.id,
          startTime: new Date('2024-10-09T11:00:00'),
          endTime: new Date('2024-10-09T11:45:00'),
          status: 'confirmed',
          priceAtBooking: 9000,
        },
      ]);
      console.log('✅ Bookings created!\n');

      // 8. Create sample API keys (use environment variables in production)
      console.log('🔑 Creating API keys...');
      await db.insert(apiKeys).values([
        { name: 'Stripe Production', provider: 'Stripe', key: 'YOUR_STRIPE_KEY_HERE', environment: 'production', isActive: true },
        { name: 'SendGrid Email', provider: 'SendGrid', key: 'YOUR_SENDGRID_KEY_HERE', environment: 'production', isActive: true },
        { name: 'Twilio SMS', provider: 'Twilio', key: 'YOUR_TWILIO_KEY_HERE', environment: 'production', isActive: false },
      ]);
      console.log('✅ API keys created!\n');

      console.log('🎉 Database seeding complete!');
      console.log('\n📊 Summary:');
      console.log(`   - 3 Packages`);
      console.log(`   - 3 Businesses`);
      console.log(`   - 12 Services`);
      console.log(`   - 6 Staff members`);
      console.log(`   - 5 Clients`);
      console.log(`   - 4 Bookings`);
      console.log(`   - 3 API Keys`);
    } else {
      console.log('⚠️  No users found. Please create a user account first.');
    }
  } catch (error: any) {
    console.error('❌ Seeding failed!');
    console.error(error);
  }
}

main();

