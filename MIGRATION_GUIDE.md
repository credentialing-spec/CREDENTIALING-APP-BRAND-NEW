# Vercel Postgres Migration Guide

## Setup Steps

### 1. Create Vercel Postgres Database

1. Log in to your Vercel account at https://vercel.com
2. Go to your project or create a new one
3. Navigate to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres** 
6. Choose your database name and region
7. Click **Create**

### 2. Get Database Connection Strings

After creating the database:

1. Go to the **Settings** tab of your database
2. Click on **.env.local** tab
3. Copy all the environment variables shown

### 3. Configure Local Environment

1. In your project root, create a `.env.local` file
2. Paste the environment variables from Vercel:

```bash
POSTGRES_URL="************"
POSTGRES_PRISMA_URL="************"
POSTGRES_URL_NO_SSL="************"
POSTGRES_URL_NON_POOLING="************"
POSTGRES_USER="************"
POSTGRES_HOST="************"
POSTGRES_PASSWORD="************"
POSTGRES_DATABASE="************"
```

### 4. Initialize Database Tables

Run the initialization endpoint to create tables:

**Option A: Using the browser (development only)**
1. Start your dev server: `npm run dev`
2. Navigate to: http://localhost:3000/api/init-db
3. You should see: `{"message":"Database initialized successfully"}`

**Option B: Using curl**
```bash
curl http://localhost:3000/api/init-db
```

**Option C: Run SQL directly in Vercel**
1. Go to your Vercel database dashboard
2. Click on the **Query** tab
3. Copy and paste the contents of `database/schema.sql`
4. Click **Run Query**

### 5. Verify Database Setup

Check that tables were created:
1. Go to Vercel database dashboard
2. Click on **Data** tab
3. You should see two tables: `providers` and `insurance_applications`

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically use the environment variables from your database
4. Deploy!

## Migration Notes

### What Changed

- **Storage**: Migrated from JSON files (`data/providers.json`, `data/insurance.json`) to Postgres database
- **API Routes**: All routes now use SQL queries instead of file operations
- **Data Structure**: Field names converted from camelCase to snake_case (SQL convention)

### Field Name Mappings

**Providers:**
- `firstName` → `first_name`
- `lastName` → `last_name`
- `middleInitial` → `middle_initial`
- `dateOfBirth` → `date_of_birth`
- And so on...

**Insurance Applications:**
- `providerId` → `provider_id`
- `insuranceName` → `insurance_name`
- `submissionDate` → `submission_date`
- And so on...

### Data Migration (Optional)

If you have existing data in JSON files that you want to migrate:

1. Keep your JSON files temporarily
2. Create a migration script to read JSON and insert into Postgres
3. Or manually re-enter the data through the UI

### Important Notes

- The `status` and `category` fields were removed from providers table (as per recent updates)
- The `status` field was removed from insurance_applications table
- All file upload fields store filenames as strings (actual file storage needs separate implementation)
- Dates are stored as DATE type in Postgres
- Timestamps (`created_at`, `updated_at`) are automatically managed

### Testing

After deployment, test:
1. ✅ Add a new provider
2. ✅ View providers list
3. ✅ Add insurance applications
4. ✅ View insurance applications
5. ✅ Edit insurance applications
6. ✅ Dashboard statistics

## Troubleshooting

**Error: "relation 'providers' does not exist"**
- Run the init-db endpoint: http://localhost:3000/api/init-db

**Error: "Failed to fetch providers"**
- Check that your `.env.local` file has the correct database credentials
- Verify the database is running in Vercel dashboard

**Error: "Connection refused"**
- Make sure you're using the correct Vercel Postgres connection strings
- Check that your database region is accessible

## Support

For Vercel Postgres documentation: https://vercel.com/docs/storage/vercel-postgres
