import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL not set');
}

const resolvedDatabaseUrl = databaseUrl;

async function setupDatabase() {
  try {
    // Extract connection details from DATABASE_URL
    const url = new URL(resolvedDatabaseUrl.split('?')[0]); // Remove query params
    
    const connection = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port) || 4000,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
      ssl: {
        rejectUnauthorized: true
      }
    });

    console.log('✅ Connected to TiDB Cloud');

    // Create table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS rsvp_entries (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        brand_name VARCHAR(255) NOT NULL,
        guest_count INT NOT NULL,
        guest_names JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Table rsvp_entries created successfully');

    await connection.end();
    console.log('✅ Database setup complete');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupDatabase();
