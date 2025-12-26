# Silent AWS Audit Report Viewer

A clean, document-focused web-based viewer for Silent AWS Audit reports. Designed to feel like a decision document, not software.

## Features

- **Read-only interface** - No operational controls or live data
- **Document-like design** - Clean, executive-friendly layout
- **Expandable findings** - Collapsible cards for detailed information
- **Priority overview** - Quick scan table for executives
- **Recommendations roadmap** - Time-based action items
- **Token-based authentication** - Simple access control
- **PDF export** - Print/export functionality

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Static JSON data (no backend required initially)

## Getting Started

### Development

```bash
cd report-viewer
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Accessing Reports

Reports are accessed via token-based authentication:

1. Visit the report URL with a token: `http://localhost:3000?token=your-token-here`
2. Or enter the token in the login form

For development, any token will grant access. In production, implement token validation against your backend.

### Data Structure

Reports are stored as JSON files in `data/`. The structure is defined in `types/report.ts`.

### Deployment

The app can be deployed as a static site or Next.js application:

```bash
npm run build
npm start
```

For static export (if needed):
- Configure `next.config.js` for static export
- Deploy to Vercel, Netlify, or any static hosting

## Design Principles

- **No charts or graphs** - Text-focused, decision-oriented
- **Neutral color palette** - No red/yellow/green severity colors
- **Generous whitespace** - Easy to read and scan
- **Executive-friendly** - Works for both technical and non-technical audiences
- **Read-only** - No "fix now" buttons or operational controls

## Customization

### Brand Colors

Update CSS variables in `app/globals.css`:
- `--montebay-navy`: Primary dark color
- `--montebay-blue`: Accent color

### Report Data

Modify `data/sample-report.json` or implement a backend API to fetch reports dynamically based on the authentication token.

## Future Enhancements

- Backend API integration for dynamic report loading
- Token validation against database
- Multiple report versions/history
- Email notifications when reports are ready
- Signed URL generation for secure access
