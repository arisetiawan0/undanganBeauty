import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { getDatabaseUrl } from '@/lib/env';

// Get database URL from environment variable
const DATABASE_URL = getDatabaseUrl();
const databaseUrl = new URL(DATABASE_URL);

// Create MySQL connection pool
const pool = mysql.createPool({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port) || 4000,
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  }
});

// Create Drizzle ORM instance
export const db = drizzle(pool, { schema, mode: 'default' });

// Export schema for use in other files
export { schema };

// Health check function
export async function checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
  try {
    // Simple query to test connection
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    return { healthy: true };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { 
      healthy: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}
