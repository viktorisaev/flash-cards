import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Using the synchronous connection API for better compatibility with Next.js
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

// Export the schema
export * from './schema'; 