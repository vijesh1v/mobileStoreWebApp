import db from './database';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Execute schema
db.exec(schema);

console.log('Database initialized successfully!');

// Import and run seed
import('./seed').then(() => {
  console.log('Database setup complete!');
  db.close();
  process.exit(0);
}).catch((error) => {
  console.error('Error seeding database:', error);
  db.close();
  process.exit(1);
});

