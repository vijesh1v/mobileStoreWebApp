import db from './database';
import fs from 'fs';
import path from 'path';

export function ensureDatabaseInitialized() {
  try {
    // Check if tables exist by trying to query the users table
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('users', 'products', 'cart_items', 'orders', 'order_items')
    `).all() as { name: string }[];

    const tableNames = tables.map(t => t.name);
    const requiredTables = ['users', 'products', 'cart_items', 'orders', 'order_items'];
    const missingTables = requiredTables.filter(t => !tableNames.includes(t));

    if (missingTables.length > 0) {
      console.log('Database tables not found. Initializing database...');
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      db.exec(schema);
      console.log('Database initialized successfully!');
    }
  } catch (error: any) {
    console.error('Error checking/initializing database:', error.message);
    throw error;
  }
}



