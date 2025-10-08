import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('📅 Creating today\'s bookings...\n');

  try {
    // Get first business, services, staff, and clients
    const businessResult = await pool.query('SELECT id FROM businesses LIMIT 1');
    if (businessResult.rows.length === 0) {
      console.log('⚠️  No businesses found. Please run seed-simple.ts first.');
      return;
    }

    const businessId = businessResult.rows[0].id;

    const servicesResult = await pool.query('SELECT id, price FROM services WHERE business_id = $1 LIMIT 3', [businessId]);
    const staffResult = await pool.query('SELECT id FROM staff WHERE business_id = $1 LIMIT 2', [businessId]);
    const clientsResult = await pool.query('SELECT id FROM clients WHERE business_id = $1 LIMIT 3', [businessId]);

    if (servicesResult.rows.length === 0 || staffResult.rows.length === 0 || clientsResult.rows.length === 0) {
      console.log('⚠️  Missing data. Please run seed-simple.ts first.');
      return;
    }

    // Create bookings for today
    const today = new Date();
    const bookingsToCreate = [
      { hour: 10, minute: 0, serviceIdx: 0, staffIdx: 0, clientIdx: 0, status: 'confirmed' },
      { hour: 11, minute: 30, serviceIdx: 1, staffIdx: 1, clientIdx: 1, status: 'pending' },
      { hour: 14, minute: 0, serviceIdx: 2, staffIdx: 0, clientIdx: 2, status: 'confirmed' },
      { hour: 15, minute: 30, serviceIdx: 0, staffIdx: 1, clientIdx: 0, status: 'confirmed' },
      { hour: 17, minute: 0, serviceIdx: 1, staffIdx: 0, clientIdx: 1, status: 'pending' },
    ];

    for (const booking of bookingsToCreate) {
      const startTime = new Date(today);
      startTime.setHours(booking.hour, booking.minute, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);

      const service = servicesResult.rows[booking.serviceIdx % servicesResult.rows.length];
      const staff = staffResult.rows[booking.staffIdx % staffResult.rows.length];
      const client = clientsResult.rows[booking.clientIdx % clientsResult.rows.length];

      await pool.query(`
        INSERT INTO bookings (business_id, client_id, service_id, staff_id, start_time, end_time, status, price_at_booking)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [businessId, client.id, service.id, staff.id, startTime, endTime, booking.status, service.price]);
    }

    console.log(`✅ Created ${bookingsToCreate.length} bookings for today!`);
    console.log('\n🎉 You can now see real data in the dashboard!');
  } catch (error: any) {
    console.error('❌ Failed to create bookings!');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();



