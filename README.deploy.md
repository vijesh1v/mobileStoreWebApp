**Deployment Guide — Railway (recommended) and GHCR image**

This document provides copy/paste steps to deploy `mobileStoreWebApp` to Railway using the repository `Dockerfile` (recommended) or using the GHCR image published by the included workflow.

Prerequisites
- Railway account with GitHub access
- Repository pushed to GitHub (this repo)
- (Optional) GHCR access if you want Railway to pull a container image instead of building

Important project details
- Dockerfile: root `Dockerfile` — multi-stage build that builds client & server and produces a production runtime image.
- GH Actions workflow: `.github/workflows/docker-publish.yml` — builds and pushes image to `ghcr.io/<owner>/mobile-store-railway:latest` on pushes to `main`.
- Persistent disk mount path (recommended): `/app/server/data` — used for SQLite `store.db`.
- Server expects environment variables: `PORT`, `NODE_ENV`, `JWT_SECRET`, `DATABASE_PATH`, `CLIENT_URL` (optional)

Railway UI: Deploy from Repository (Recommended)
1. Create project & connect repo
   - Login to Railway, click **New Project** → **Deploy from GitHub**.
   - Select the `vijesh1v/mobileStoreWebApp` repository and branch `main`.

2. Create service using Dockerfile
   - When Railway asks how to deploy, choose **Docker** or select the repository Dockerfile.
   - Railway will run `docker build` using the repo `Dockerfile` (no build command required).

3. Add Persistent Disk plugin
   - Open Project → **Plugins** → **Add Plugin** → **Persistent Disk**.
   - Attach to your service and set **Container Path** to `/app/server/data`.

4. Add Environment Variables (Service → Variables)
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = (secure random string)
   - `DATABASE_PATH` = `/app/server/data/store.db`
   - `CLIENT_URL` = (optional — restrict CORS)

5. Deploy
   - Trigger a manual deploy or push to `main` to auto-deploy.
   - Monitor **Deploys / Logs**. Expected steps:
     - Docker build, `npm run build` for both workspaces
     - Final image creation and container start

6. Verify
   - Health check: `GET https://<railway-service-url>/api/health` should return JSON with `status: ok`.
   - Visit `https://<railway-service-url>/` to confirm frontend is served.
   - If DB tables missing, server runs initialization from `dist/db/schema.sql` automatically on first start.

Railway UI: Deploy from Image (GHCR)
1. Ensure image is published
   - The workflow `docker-publish.yml` pushes images to `ghcr.io/<owner>/mobile-store-railway:latest` on pushes to `main`.
   - If using GHCR, either make the image public or provide Railway with credentials (GHCR requires a PAT with `packages:read` access for private images).

2. Create service from Image
   - New Project → **Deploy from Image** → enter `ghcr.io/<owner>/mobile-store-railway:latest`.
   - Provide registry credentials if the image is private (Railway Settings → Services → Registry credentials or as secrets).

3. Add Persistent Disk + Env vars and verify as above.

CI / GHCR notes
- The included workflow uses `${{ secrets.GITHUB_TOKEN }}` to authenticate to GHCR (it can push to the owner's namespace). If you want to change visibility or use a specific PAT, update the workflow.
- Image tags pushed: `:latest` and `:<sha>`.

Local testing (before pushing)
- Build both workspaces locally and run server:
```bash
npm run install:all
npm run build
cd server
cp .env.example .env   # or use server/ENV_SETUP.txt to create .env
npm run db:setup
npm start
```
- Or run the built Docker image locally (mount persistent DB):
```bash
mkdir -p ./server/data
docker run -d \
  --name mobile-store-railway \
  -p 5000:5000 \
  -v "$PWD/server/data":/app/server/data \
  -e PORT=5000 \
  -e NODE_ENV=production \
  -e JWT_SECRET='replace-with-secure' \
  -e DATABASE_PATH=/app/server/data/store.db \
  mobile-store-railway:latest
```

Troubleshooting tips
- Build fails in Railway: check logs; common issues include TypeScript strict errors or missing dev deps. We updated the Dockerfile and added fixes for `better-sqlite3` typings and Vite `terser` requirement.
- DB file not persistent: ensure Persistent Disk is mounted to `/app/server/data` and `DATABASE_PATH` points there.
- CORS: set `CLIENT_URL` env var to your frontend host to restrict origins.

If you'd like, I can:
- Provide a ready-to-copy environment variable list for Railway UI.
- Help inspect deploy logs if you paste them here.
- Create a small `railway.setup.sh` script for one-off tasks (seeding) if you want.

End of deployment guide.
