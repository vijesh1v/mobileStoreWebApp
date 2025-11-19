import Database = require('better-sqlite3');
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/store.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db: any = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;

