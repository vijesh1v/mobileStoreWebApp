import db from './database';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Execute schema
db.exec(schema);

console.log('Database initialized successfully!');
console.log('Tables created: users, products, cart_items, orders, order_items');

db.close();

