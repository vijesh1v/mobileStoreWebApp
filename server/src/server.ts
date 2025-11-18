import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import checkoutRoutes from './routes/checkout';
import orderRoutes from './routes/orders';
import { ensureDatabaseInitialized } from './db/ensureDatabase';

dotenv.config();

// Ensure database is initialized before starting server
try {
  ensureDatabaseInitialized();
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const isProduction = process.env.NODE_ENV === 'production';
const clientUrl = process.env.CLIENT_URL || (isProduction ? undefined : 'http://localhost:5173');

app.use(cors({
  origin: clientUrl || true, // Allow all origins in production if CLIENT_URL not set
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (must come before static file serving)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Serve static files from React app in production
if (isProduction) {
  // In production, dist folder is at server/dist, so we go up to root then to client/dist
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
  
  // Catch all handler: send back React's index.html file for client-side routing
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Development: API info route
  app.get('/', (req, res) => {
    res.json({
      message: 'Mobile Store API Server',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        products: '/api/products',
        cart: '/api/cart',
        checkout: '/api/checkout',
        orders: '/api/orders'
      },
      note: 'This is the API server. The frontend runs on http://localhost:5173'
    });
  });
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}).on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

