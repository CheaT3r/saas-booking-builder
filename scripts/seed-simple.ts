import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('🌱 Seeding database with sample data...\n');

  try {
    // 1. Create packages
    console.log('📦 Creating packages...');
    await pool.query(`
      INSERT INTO packages (name, description, price_monthly, price_annually, features, max_users, max_bookings, api_access, custom_branding, priority_support)
      VALUES 
        ('Starter', 'Perfect pentru început - ideal pentru business-uri mici', 4900, 49000, '["100 programări/lună", "Email notifications", "Dashboard basic", "Suport standard"]'::jsonb, 1, 100, false, false, false),
        ('Professional', 'Pentru business-uri în creștere cu nevoi avansate', 14900, 149000, '["Programări nelimitate", "Email & SMS notifications", "Dashboard avansat", "Rapoarte detaliate", "Suport prioritar", "5 utilizatori"]'::jsonb, 5, NULL, false, true, true),
        ('Enterprise', 'Pentru companii mari cu cerințe complexe', 49900, 499000, '["Totul din Professional", "API Access", "Custom branding complet", "Utilizatori nelimitați", "Suport dedicat 24/7", "Manager de cont dedicat"]'::jsonb, NULL, NULL, true, true, true)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Packages created!\n');

    // 2. Get first user to assign as owner
    const userResult = await pool.query('SELECT id, email FROM "user" LIMIT 1');
    
    if (userResult.rows.length === 0) {
      console.log('⚠️  No users found. Please sign up first at http://localhost:3000/sign-up');
      return;
    }

    const userId = userResult.rows[0].id;
    console.log(`👤 Using user: ${userResult.rows[0].email}\n`);

    // Set as super admin
    await pool.query(`
      INSERT INTO user_roles (user_id, role, permissions)
      VALUES ($1, 'super_admin', '["*"]'::jsonb)
      ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', permissions = '["*"]'::jsonb;
    `, [userId]);

    // 3. Create demo businesses
    console.log('🏢 Creating demo businesses...');
    const businessResult = await pool.query(`
      INSERT INTO businesses (owner_id, name, slug, tagline, description, address, phone, email, website, primary_color, accent_color)
      VALUES 
        ($1, 'Premium Salon & Spa', 'premium-salon-spa', 'Your Beauty, Our Passion', 'Salon premium cu servicii complete de înfrumusețare și relaxare.', 'Str. Victoriei 123, București', '+40 721 123 456', 'contact@premium-salon.ro', 'https://premium-salon.ro', '#ec4899', '#8b5cf6'),
        ($1, 'Dental Clinic Pro', 'dental-clinic-pro', 'Healthy Smile, Happy Life', 'Clinică stomatologică modernă cu echipamente de ultimă generație.', 'Bd. Unirii 45, București', '+40 722 234 567', 'contact@dental-pro.ro', 'https://dental-pro.ro', '#3b82f6', '#06b6d4'),
        ($1, 'Barbershop Classic', 'barbershop-classic', 'Traditional Cuts, Modern Style', 'Frizerie clasică pentru bărbați cu atmosferă vintage.', 'Str. Lipscani 78, București', '+40 723 345 678', 'contact@barbershop-classic.ro', 'https://barbershop-classic.ro', '#f97316', '#ef4444')
      ON CONFLICT (slug) DO NOTHING
      RETURNING id, name;
    `, [userId]);
    console.log(`✅ Created ${businessResult.rows.length} businesses!\n`);

    if (businessResult.rows.length === 0) {
      console.log('ℹ️  Businesses already exist, skipping services/staff/bookings...\n');
      console.log('🎉 Seeding complete!');
      return;
    }

    const [salon, dental, barber] = businessResult.rows;

    // 4. Create services
    console.log('💇 Creating services...');
    const servicesResult = await pool.query(`
      INSERT INTO services (business_id, name, description, duration, price, category)
      VALUES 
        ($1, 'Tuns & Styling', 'Tuns profesional și styling complet', 60, 15000, 'Hair'),
        ($1, 'Vopsit Păr', 'Vopsit profesional cu produse premium', 120, 25000, 'Hair'),
        ($1, 'Manichiură', 'Manichiură completă cu ojă gel', 45, 8000, 'Nails'),
        ($1, 'Masaj Terapeutic', 'Masaj relaxant 60 minute', 60, 28000, 'Wellness'),
        ($2, 'Consultație Dentară', 'Consultație completă cu plan de tratament', 30, 10000, 'Consultation'),
        ($2, 'Detartraj', 'Curățare profesională și detartraj', 45, 20000, 'Cleaning'),
        ($3, 'Tuns Clasic', 'Tuns clasic pentru bărbați', 30, 6000, 'Hair'),
        ($3, 'Tuns & Barbă', 'Tuns complet plus aranjare barbă', 45, 9000, 'Hair')
      RETURNING id;
    `, [salon.id, dental.id, barber.id]);
    console.log(`✅ Created ${servicesResult.rows.length} services!\n`);

    // 5. Create staff
    console.log('👨‍💼 Creating staff...');
    const staffResult = await pool.query(`
      INSERT INTO staff (business_id, name, email, phone, specialty, bio)
      VALUES 
        ($1, 'Elena Georgescu', 'elena@premium-salon.ro', '+40 721 111 111', 'Hair Stylist Senior', 'Peste 15 ani experiență în styling.'),
        ($1, 'Andrei Mihai', 'andrei@premium-salon.ro', '+40 721 222 222', 'Maseur Terapeut', 'Specializat în masaj terapeutic.'),
        ($2, 'Dr. Alex Ionescu', 'alex@dental-pro.ro', '+40 722 111 111', 'Medic Stomatolog', '10 ani experiență în stomatologie.'),
        ($3, 'George Stan', 'george@barbershop-classic.ro', '+40 723 111 111', 'Master Barber', 'Specialist în tuns clasic.')
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `, [salon.id, dental.id, barber.id]);
    console.log(`✅ Created ${staffResult.rows.length} staff members!\n`);

    // 6. Create clients
    console.log('👥 Creating clients...');
    const clientsResult = await pool.query(`
      INSERT INTO clients (business_id, name, email, phone)
      VALUES 
        ($1, 'Maria Ionescu', 'maria.ionescu@email.com', '+40 744 111 111'),
        ($1, 'Diana Popa', 'diana.popa@email.com', '+40 744 222 222'),
        ($2, 'Ion Georgescu', 'ion.georgescu@email.com', '+40 744 333 333'),
        ($3, 'Andrei Pop', 'andrei.pop@email.com', '+40 744 444 444')
      RETURNING id;
    `, [salon.id, dental.id, barber.id]);
    console.log(`✅ Created ${clientsResult.rows.length} clients!\n`);

    // 7. Create API Keys (use environment variables in production)
    console.log('🔑 Creating API keys...');
    await pool.query(`
      INSERT INTO api_keys (name, provider, key, environment, is_active)
      VALUES 
        ('Stripe Production', 'Stripe', 'YOUR_STRIPE_KEY_HERE', 'production', true),
        ('SendGrid Email', 'SendGrid', 'YOUR_SENDGRID_KEY_HERE', 'production', true),
        ('Twilio SMS', 'Twilio', 'YOUR_TWILIO_KEY_HERE', 'production', false)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ API keys created!\n');

    console.log('🎉 Database seeding complete!');
    console.log('\n📊 Summary:');
    console.log(`   - 3 Packages`);
    console.log(`   - ${businessResult.rows.length} Businesses`);
    console.log(`   - ${servicesResult.rows.length} Services`);
    console.log(`   - ${staffResult.rows.length} Staff members`);
    console.log(`   - ${clientsResult.rows.length} Clients`);
    console.log(`   - 3 API Keys`);
    console.log(`\n✨ You can now access:`);
    console.log(`   - Dashboard: http://localhost:3000/dashboard`);
    console.log(`   - Admin Panel: http://localhost:3000/admin`);
  } catch (error: any) {
    console.error('❌ Seeding failed!');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();



