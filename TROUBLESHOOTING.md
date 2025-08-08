# Troubleshooting Guide

## HTTP 500 Error in MemoList Component

### Problem
The application is throwing a `HTTP error! status: 500` when trying to fetch memos from `/api/memos`.

### Root Cause
The most common cause is missing Supabase environment variables.

### Solution

1. **Create `.env.local` file** in the project root if it doesn't exist:
   ```bash
   touch .env.local
   ```

2. **Add the required Supabase environment variables** to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Get your Supabase credentials**:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings → API
   - Copy the "Project URL" for `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the "service_role" key for `SUPABASE_SERVICE_ROLE_KEY`

4. **Restart the development server**:
   ```bash
   npm run dev
   ```

### Additional Checks

- Ensure your Supabase project has a `memos` table with the correct schema
- Check that your Supabase project is active and not paused
- Verify that the service role key has the necessary permissions

### Error Messages

After the fix, you should see more descriptive error messages if configuration issues persist:
- "NEXT_PUBLIC_SUPABASE_URL environment variable is required"
- "SUPABASE_SERVICE_ROLE_KEY environment variable is required"
- "サーバー設定エラー" with hints about environment variables

### Database Schema

Make sure your `memos` table has these columns:
- `id` (uuid, primary key)
- `title` (text)
- `items` (text, nullable)
- `text_content` (text, nullable)  
- `images` (text, nullable)
- `urls` (text, nullable)
- `type` (text)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)