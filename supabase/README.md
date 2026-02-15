# Supabase setup

## Step 2: Project + database

1. Go to [supabase.com](https://supabase.com) → sign in → **New project**.
2. Pick org, name (e.g. `smart-bookmark`), database password, region. Create.
3. In the project: **SQL Editor** → **New query** → paste contents of `schema.sql` → **Run**.
4. If the last line (Realtime publication) errors, enable Realtime for `bookmarks` in **Database** → **Replication** instead.

Your table: `bookmarks` with `id`, `user_id`, `url`, `title`, `created_at`. RLS keeps rows private per user.

## Step 3: Google OAuth

1. **Google Cloud Console:** [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → **Credentials** → **Create credentials** → **OAuth client ID**. Application type: **Web application**. Add **Authorized redirect URI**: copy from Supabase (step 2).
2. **Supabase Dashboard:** Your project → **Authentication** → **Providers** → **Google** → Enable. Paste **Client ID** and **Client Secret** from Google. Save.
3. **Supabase Auth URL config:** **Authentication** → **URL Configuration**. Set **Site URL** to your app URL (e.g. `http://localhost:3000` for dev). Add **Redirect URL** `http://localhost:3000/auth/callback` (and your production URL later).
4. Copy **Project URL** and **anon public** key from **Settings** → **API** into your app `.env` (see `.env.example`).

## Realtime not updating?

If the app only updates after refresh, check: **Database** → **Replication** → ensure **bookmarks** is in the `supabase_realtime` publication (toggle on if needed). The WebSocket must be allowed to connect for live updates.
