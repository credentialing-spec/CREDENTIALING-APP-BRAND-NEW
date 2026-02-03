# AllStar Billing Service - Credentialing Application

A comprehensive provider credentialing management system built with Next.js 15.

## Features

- **Provider Management**: Add, view, and track healthcare provider credentials
- **Insurance Applications**: Manage payer enrollment applications with automatic due date calculations
- **Dashboard**: Real-time statistics and quick actions
- **Admin Portal**: Password-protected access to all provider information
- **Data Persistence**: JSON file-based storage system

## Tech Stack

- **Framework**: Next.js 15.5.9 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Brand color: Burgundy #800020)
- **Storage**: JSON file system (located in `/data` directory)
- **Authentication**: Session-based admin access

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Dashboard homepage
│   ├── admin/
│   │   └── page.tsx                # Admin portal (Password: admin123)
│   ├── credentials/
│   │   ├── page.tsx                # All Providers list
│   │   ├── add/
│   │   │   └── page.tsx            # Add Provider form
│   │   └── insurance/
│   │       └── page.tsx            # Insurance Applications
│   └── api/
│       ├── providers/
│       │   ├── route.ts            # Provider CRUD endpoints
│       │   └── [id]/route.ts       # Single provider operations
│       └── insurance/
│           ├── route.ts            # Insurance CRUD endpoints
│           └── [id]/route.ts       # Single insurance operations
├── components/
│   └── DashboardLayout.tsx         # Main navigation layout
└── lib/
    └── storage.ts                  # JSON file storage system

data/
├── providers.json                  # Provider records
└── insurance.json                  # Insurance application records
```

## Key Features

### Add Provider Form
Comprehensive intake form with 10 sections:
- Personal Information
- Education
- Professional License
- DEA License
- Board Certifications
- Individual NPI
- Group Information
- Malpractice Insurance
- CAQH Information
- Status & Notes

### Insurance Applications
- Select provider from database
- Dynamic insurance entry system
- 21 insurance companies (alphabetically sorted)
- Auto-calculated due dates (90 days from submission)
- Method of submission tracking (Email, Fax, Mail, Web Submission)
- Provider number and reference number tracking

### Dashboard
- Total provider count
- Total insurance applications
- Quick action buttons
- Real-time statistics

### Admin Portal
- Password: `admin123`
- View all provider details
- Session-based authentication

## Data Storage

The application uses a simple JSON file-based storage system:

- **Location**: `/data` directory (auto-created on first use)
- **Files**: `providers.json` and `insurance.json`
- **Structure**: Each file contains an array of records and an auto-incrementing ID counter
- **Relationships**: Insurance applications are linked to providers via `providerId`

### Future Migration

The current JSON storage system is designed as an interim solution. The API structure supports easy migration to Vercel Postgres or other databases without changing frontend code.

## API Endpoints

### Providers
- `GET /api/providers` - Get all providers
- `POST /api/providers` - Create new provider
- `GET /api/providers/[id]` - Get provider by ID
- `PUT /api/providers/[id]` - Update provider
- `DELETE /api/providers/[id]` - Delete provider (cascade deletes insurance)

### Insurance Applications
- `GET /api/insurance` - Get all applications (supports `?providerId=X` filter)
- `POST /api/insurance` - Create insurance applications
- `GET /api/insurance/[id]` - Get application by ID
- `PUT /api/insurance/[id]` - Update application
- `DELETE /api/insurance/[id]` - Delete application

## Development Notes

- Dev server runs on `http://localhost:3000`
- Data persists between server restarts
- The `/data` directory is gitignored to prevent committing sensitive information
- All dates are stored in YYYY-MM-DD format
- Insurance due dates are automatically calculated as 90 days from submission date

## Brand Guidelines

- Primary Color: Burgundy (#800020)
- Logo: Located at `/public/logo.png`
- Company: AllStar Billing Service

## Admin Access

Default admin password: `admin123`

⚠️ **Security Note**: Change this password in production by updating the authentication logic in `/src/app/admin/page.tsx`
