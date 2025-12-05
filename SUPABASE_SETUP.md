# Supabase Backend Setup Guide

This guide explains how to set up Supabase as the backend database for the Gym Tracker application.

## Overview

The Gym Tracker now uses **Supabase** (PostgreSQL) as its primary backend database with automatic syncing. The app features:

- **Automatic cloud backup**: All workout data is automatically saved to Supabase
- **Offline support**: localStorage fallback when Supabase is unavailable
- **Real-time sync**: Data syncs across devices when using the same account
- **Secure authentication**: Supabase Auth handles user authentication
- **Row-level security**: Each user can only access their own data

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Gym Tracker (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project" and wait for it to initialize (~2 minutes)

## Step 2: Set Up the Database Schema

1. In your Supabase project dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from your project root
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema

This will create:
- **users** table: Stores user profiles
- **user_progression** table: Tracks current week and completed days
- **workout_sessions** table: Stores all completed workouts
- **Row Level Security policies**: Ensures data privacy
- **Indexes**: For optimal query performance

## Step 3: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Find two important values:
   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

## Step 4: Configure Your App

1. In your project root, open `.env` file
2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file
4. Restart your development server:

```bash
npm run dev
```

## Step 5: Test the Integration

1. Open the app in your browser (`http://localhost:5173`)
2. Create a new account or sign in
3. Start a workout and complete some exercises
4. Go to your Supabase dashboard → **Table Editor**
5. Check the following tables:
   - **users**: Should show your user profile
   - **user_progression**: Should show your current week/day
   - **workout_sessions**: Should show your completed workouts

## How It Works

### Authentication Flow
1. User signs up → Supabase Auth creates account
2. User profile created in `users` table
3. Initial progression record created
4. User automatically logged in

### Data Sync Flow
1. User completes workout → Saved to localStorage first (instant)
2. Data automatically synced to Supabase in background
3. On login → Latest data fetched from Supabase
4. Offline mode → Uses localStorage until connection restored

### Security
- **Row Level Security (RLS)**: Each user can only access their own data
- **Encrypted localStorage**: Local data encrypted as backup
- **Secure authentication**: Supabase Auth handles password hashing
- **HTTPS only**: All API calls encrypted in transit

## Offline Mode

If Supabase is not configured or unavailable, the app automatically falls back to:
- **localStorage**: For data persistence
- **Local authentication**: User accounts stored in browser
- **Manual backups**: Export/import from Settings page

This ensures the app works even without internet connection.

## Troubleshooting

### "Invalid API credentials" error
- Double-check your `.env` file has correct URL and key
- Make sure you restart the dev server after changing `.env`
- Verify you copied the **anon public** key, not the service role key

### Data not syncing
- Check browser console for errors (F12 → Console tab)
- Verify your Supabase project is active (not paused)
- Check RLS policies are enabled in Supabase dashboard

### Can't sign up
- Check Supabase Auth settings: **Authentication** → **Providers**
- Make sure "Email" provider is enabled
- Check "Email confirmations" settings (can disable for development)

## Production Deployment

When deploying to GitHub Pages or other hosting:

1. Set environment variables in your hosting platform:
   - For GitHub Pages: Use repository secrets
   - For Vercel/Netlify: Add in dashboard environment variables

2. Update CORS settings in Supabase:
   - Go to **Settings** → **API** → **CORS**
   - Add your production domain

3. Enable email confirmations (optional):
   - Go to **Authentication** → **Settings**
   - Enable "Confirm email"
   - Configure email templates

## Database Maintenance

### Backup Your Data
The database schema includes automatic backups, but you can also:
- Use Supabase's built-in backup feature (Settings → Database → Backups)
- Export data using the app's export feature (Settings → Export Data)

### Monitor Usage
- Free tier: 500 MB database, 2 GB bandwidth/month
- Check usage: Dashboard → Settings → Usage

### Query Performance
- All tables have indexes for optimal performance
- Check slow queries: Dashboard → Database → Query Performance

## Support

For issues:
1. Check browser console for errors
2. Check Supabase logs: Dashboard → Logs → API
3. Verify RLS policies: Dashboard → Authentication → Policies

## Next Steps

- ✅ Configure custom email templates
- ✅ Set up automated backups
- ✅ Monitor usage and performance
- ✅ Add analytics (optional)
