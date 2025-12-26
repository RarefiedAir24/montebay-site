# Deployment Guide - Report Viewer

## Quick Setup for Vercel

The report viewer is a Next.js app that needs to be deployed as a **separate Vercel project**.

### Option 1: Separate Vercel Project (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select `RarefiedAir24/montebay-site`
   - Click "Import"

3. **Configure Project Settings**
   - **Project Name**: `montebay-report-viewer` (or your preferred name)
   - **Root Directory**: `report-viewer`
   - **Framework Preset**: Next.js (should auto-detect)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Environment Variables** (if needed later)
   - None required for now (sample report is static)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

6. **Custom Domain** (Optional)
   - After deployment, go to Settings → Domains
   - Add custom domain: `reports.montebay.io` (or subdirectory)

### Option 2: Deploy to Subdirectory on Same Domain

If you want the report viewer at `montebay.io/silent-aws-audit/sample-report`:

1. **Update next.config.ts**:
   ```typescript
   const nextConfig: NextConfig = {
     basePath: '/silent-aws-audit',
     output: 'standalone',
   };
   ```

2. **Deploy as separate project** with custom domain pointing to main domain

3. **Update link in index.html** to match the deployment path

### Current Link Configuration

The main site (`index.html`) links to:
```html
<a href="/silent-aws-audit/sample-report" ...>
```

This assumes:
- **Option A**: Report viewer deployed to same domain at `/silent-aws-audit/*`
- **Option B**: Report viewer on subdomain, update link to `https://reports.montebay.io/sample-report`

### Recommended Approach

**Deploy as separate project with subdomain:**
- Main site: `montebay.io` (static HTML)
- Report viewer: `reports.montebay.io` (Next.js)

Then update the link in `index.html`:
```html
<a href="https://reports.montebay.io/silent-aws-audit/sample-report" ...>
```

### Testing Locally

```bash
cd report-viewer
npm install
npm run dev
```

Visit: `http://localhost:3000/silent-aws-audit/sample-report`

### Build Verification

```bash
cd report-viewer
npm run build
npm start
```

This ensures the production build works before deploying.

