# Quick Start - Test Supabase Connection

## 1. Set Up Environment (2 minutes)

```bash
cd integratewise-complete/apps/web

# Copy example env file
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
nano .env.local  # or use your editor
```

**Fill in:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

## 2. Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Or with doppler (if configured)
doppler run --config dev_web -- npm run dev
```

## 3. Test Connection (30 seconds)

Open browser: `http://localhost:3000/test`

You should see:
- ✅ **Connected** - Supabase is working
- User count from profiles table
- Environment variables check

## 4. Test Login Flow

Click **"Test Login"** button or go to `/login`

## Troubleshooting

### ❌ "Missing Supabase environment variables"
- Check `.env.local` exists
- Verify variables are set correctly
- Restart dev server after changes

### ❌ "Connection Failed"
- Check Supabase URL is correct
- Verify project is active in Supabase dashboard
- Check network connection
- Look at browser console for errors

### ❌ "profiles table not found"
- Run migrations: `npx supabase db push`
- Or check if tables exist in Supabase dashboard

## What's Working Now

✅ Direct Supabase connection (no abstraction)  
✅ Browser + Server + Admin clients  
✅ Test page at `/test`  
✅ Environment validation  

## Next Steps

1. ✅ Test connection at `/test`
2. ✅ Test login at `/login`
3. ➡️ Test RBAC permissions
4. ➡️ Test domain shells
