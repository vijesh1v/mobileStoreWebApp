# Deployment Guide

This guide covers deploying the Mobile Store web application to various platforms.

## Prerequisites

- Node.js 18+ installed
- Git repository set up
- Account on your chosen deployment platform

## Environment Variables

The following environment variables need to be configured in your deployment platform:

### Required Variables

- `NODE_ENV` - Set to `production`
- `PORT` - Port number (usually set automatically by platform, default: 5000)
- `JWT_SECRET` - A secure random string for JWT token signing
  - Generate one using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `DATABASE_PATH` - Path to SQLite database file (default: `./data/store.db`)

### Optional Variables

- `CLIENT_URL` - Frontend URL for CORS (leave empty to allow all origins, not recommended)
- `VITE_API_URL` - API URL for frontend (only needed if frontend and backend are on different domains)

## Deployment Options

### Option 1: Railway (Recommended)

Railway is the easiest option for deploying this application with SQLite support.

1. **Sign up** at [railway.app](https://railway.app)
2. **Create a new project** and connect your Git repository
3. **Add environment variables** in Railway dashboard:
   - `NODE_ENV=production`
   - `JWT_SECRET=<your-secret-key>`
   - `DATABASE_PATH=./data/store.db`
4. **Deploy**: Railway will automatically detect the `railway.json` configuration and deploy

The application will be available at `https://your-app-name.railway.app`

### Option 2: Render

1. **Sign up** at [render.com](https://render.com)
2. **Create a new Web Service** and connect your Git repository
3. **Configure the service**:
   - Build Command: `npm run install:all && npm run build`
   - Start Command: `cd server && npm start`
4. **Add environment variables** in Render dashboard (see Required Variables above)
5. **Deploy**: Render will build and deploy automatically

### Option 3: Docker Deployment

You can deploy using Docker to any platform that supports containers (AWS, Google Cloud, Azure, DigitalOcean, etc.).

1. **Build the Docker image**:
   ```bash
   docker build -t mobile-store .
   ```

2. **Run the container**:
   ```bash
   docker run -p 5000:5000 \
     -e NODE_ENV=production \
     -e JWT_SECRET=your-secret-key \
     -e DATABASE_PATH=./data/store.db \
     -v $(pwd)/data:/app/server/data \
     mobile-store
   ```

3. **For production**, use a container orchestration service or cloud provider's container service.

### Option 4: Vercel (Frontend) + Railway/Render (Backend)

If you want to deploy frontend and backend separately:

#### Backend (Railway/Render)
1. Deploy the server following Option 1 or 2 above
2. Note the backend URL (e.g., `https://api.railway.app`)

#### Frontend (Vercel)
1. **Sign up** at [vercel.com](https://vercel.com)
2. **Create a new project** and connect your Git repository
3. **Configure**:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add environment variable**:
   - `VITE_API_URL=https://your-backend-url/api`
5. **Deploy**

## Database Initialization

The database will automatically initialize on first server start:
- Tables are created automatically if they don't exist
- The database file is stored at the path specified in `DATABASE_PATH`
- For persistent storage, ensure the data directory is persisted (Railway and Render handle this automatically)

### Seeding the Database (Optional)

To seed the database with initial products, you can run:

```bash
cd server
npm run db:seed
```

Or in production, you can SSH into your deployment and run the seed command.

## Build Process

The build process:
1. Installs all dependencies (root, client, and server)
2. Builds the TypeScript server code
3. Copies database schema file to dist
4. Builds the React frontend
5. Server serves both API and static frontend files

## Post-Deployment

After deployment:

1. **Verify the deployment**:
   - Check health endpoint: `https://your-app-url/api/health`
   - Visit the root URL to see the frontend

2. **Test functionality**:
   - Register a new user
   - Browse products
   - Add items to cart
   - Complete checkout

3. **Monitor logs**:
   - Check platform logs for any errors
   - Verify database initialization messages

## Troubleshooting

### Database Issues
- Ensure `DATABASE_PATH` points to a writable directory
- Check that the data directory exists and has write permissions
- Verify database initialization logs

### CORS Issues
- Set `CLIENT_URL` to your frontend URL if frontend and backend are on different domains
- Or leave empty to allow all origins (development only)

### Build Failures
- Ensure Node.js version is 18+
- Check that all dependencies are installed
- Verify build scripts in package.json

### Static Files Not Loading
- Verify that `client/dist` directory exists after build
- Check server logs for static file serving errors
- Ensure `NODE_ENV=production` is set

## Security Notes

- **Never commit** `.env` files or `server/data/store.db` to Git
- Use strong, randomly generated `JWT_SECRET` in production
- Set `CLIENT_URL` to restrict CORS in production
- Consider using a production database (PostgreSQL, MySQL) for better performance and reliability
- Enable HTTPS (most platforms do this automatically)

## Support

For issues or questions, check the platform-specific documentation:
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)


