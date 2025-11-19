## Multi-stage Dockerfile
## Builds both client and server in the image so CI/CD (Railway) can build from source

FROM node:20-alpine AS deps
WORKDIR /app
# Install production deps for server only (used in final runtime image)
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev

FROM node:20-alpine AS builder
WORKDIR /app
# Copy workspace package files then install dev deps to build both workspaces
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN npm install

# Copy full repository and run the build (will build client and server via root scripts)
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/server
# Copy only production node_modules for server
COPY --from=deps /app/server/node_modules ./node_modules
# Copy built server and client artifacts
COPY --from=builder /app/server/dist ./dist
# Server expects client dist at /app/client/dist (server looks for ../../client/dist relative to server/dist)
COPY --from=builder /app/client/dist /app/client/dist

ENV NODE_ENV=production

# Start server
CMD ["node", "dist/server.js"]


