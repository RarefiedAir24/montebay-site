# Deployment Guide - Report Viewer

## Using Existing Vercel Project

You can use the existing `montebay-site` Vercel project! The configuration has been set up to handle both the static main site and the Next.js report viewer.

### Current Setup

The project is configured as a **monorepo** where:
- **Root**: Static HTML site (main Montebay site)
- **Subdirectory**: Next.js report viewer at `report-viewer/`

### Vercel Configuration

The `vercel.json` at the root includes:
- Static site configuration for the main site
- Rewrite rules to route `/silent-aws-audit/*` to the report viewer

The `report-viewer/next.config.ts` is configured with:
- `basePath: '/silent-aws-audit'` - so it serves at the correct path

### Deployment Steps

1. **Go to Vercel Dashboard**
   - Open your existing `montebay-site` project

2. **Update Project Settings** (if needed)
   - Go to Settings → General
   - **Root Directory**: Leave empty (or set to `.` for root)
   - **Framework Preset**: Should be "Other" for the static site
   - **Build Command**: Leave empty (static site, no build needed)
   - **Output Directory**: `.` (root)

3. **Add Build Configuration for Report Viewer**
   - Go to Settings → Build & Development Settings
   - The rewrite rules in `vercel.json` will handle routing
   - Vercel should auto-detect the Next.js app in `report-viewer/`

4. **Redeploy**
   - Go to Deployments
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger auto-deployment

### How It Works

1. **Main Site** (`index.html`, `styles.css`, etc.)
   - Served from root
   - No build needed (static files)

2. **Report Viewer** (`report-viewer/`)
   - Next.js app builds automatically
   - Served at `/silent-aws-audit/*` via rewrite rules
   - Example: `/silent-aws-audit/sample-report`

### Troubleshooting

If the report viewer doesn't work:

1. **Check Build Logs**
   - Go to Deployments → Latest → Build Logs
   - Look for Next.js build output

2. **Verify Next.js Detection**
   - Vercel should auto-detect Next.js in `report-viewer/`
   - If not, you may need to configure it manually

3. **Alternative: Separate Project**
   - If monorepo doesn't work, create a new Vercel project
   - Set Root Directory to `report-viewer`
   - Deploy separately

### Testing

After deployment:
- Main site: `https://montebay.io` (or your domain)
- Sample report: `https://montebay.io/silent-aws-audit/sample-report`

The link in `index.html` should work automatically!
