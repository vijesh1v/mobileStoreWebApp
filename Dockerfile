# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install:all

# Copy source files
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install production dependencies only
RUN npm ci --workspace=server --omit=dev && \
    npm ci --omit=dev

# Copy built files
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/src/db/schema.sql ./server/src/db/schema.sql

# Create data directory for database
RUN mkdir -p ./server/data

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start server
WORKDIR /app/server
CMD ["node", "dist/server.js"]

