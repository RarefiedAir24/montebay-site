# Deployment Guide for Report Viewer

## Integration with Main Site

The report viewer is a separate Next.js application that should be deployed and accessible from the main Montebay website.

### Option 1: Subdirectory Deployment (Recommended)

Deploy the report viewer to `montebay.io/silent-aws-audit/sample-report`:

1. **Vercel Configuration**
   - Create a new Vercel project for the report viewer
   - Set base path in `next.config.ts`:
   ```typescript
   const nextConfig = {
     basePath: '/silent-aws-audit',
     // ... other config
   };
   ```
   - Deploy to the same domain as the main site

2. **Alternative: Subdomain**
   - Deploy to `reports.montebay.io`
   - Update link in `index.html` to point to subdomain

### Option 2: Standalone Deployment

Deploy separately and update the link in `index.html`:

```html
<a href="https://reports.montebay.io/sample-report" ...>
```

### Current Link Configuration

The main site links to `/silent-aws-audit/sample-report` which assumes:
- The report viewer is deployed to the same domain
- OR the Next.js app is configured with `basePath: '/silent-aws-audit'`

## Development

Run locally:
```bash
cd report-viewer
npm run dev
```

Access at: `http://localhost:3000/silent-aws-audit/sample-report`

## Production Build

```bash
npm run build
npm start
```

