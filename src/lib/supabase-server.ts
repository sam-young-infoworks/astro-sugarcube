import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client for API routes
// This client doesn't use PKCE flow and is suitable for server-side operations
export const supabaseServer = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
);
