import Database = require('better-sqlite3');
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Normalize DATABASE_PATH: if provided and relative, resolve against process.cwd()
let dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/store.db');
if (!path.isAbsolute(dbPath)) {
  dbPath = path.resolve(process.cwd(), dbPath);
}
const dbDir = path.dirname(dbPath);

// Helpful log to debug where the DB file is expected
console.log(`Using database path: ${dbPath}`);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db: any = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;

