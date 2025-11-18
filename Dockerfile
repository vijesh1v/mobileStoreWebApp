# Dockerfile at repo root, building only the server subdir
FROM node:20-alpine AS deps
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app/server
COPY --from=deps /app/server/node_modules ./node_modules
# copy ONLY the server code to keep image small
COPY server/ . 
ENV NODE_ENV=production
ENV PORT=3000
CMD ["node", "src/server.js"]
