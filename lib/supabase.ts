import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseConfigured: boolean = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project")
);

// Create standard client if configured
let _supabase: SupabaseClient | null = null;

if (supabaseConfigured) {
  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Returns active Supabase client or a safe fallback proxy when unconfigured.
 * Prevents runtime crashes before environment variables are set.
 */
export const getSupabase = (): SupabaseClient | any => {
  if (_supabase) return _supabase;

  // Safe fallback proxy for unconfigured development or SSR build
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "auth") {
          return {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getUser: async () => ({ data: { user: null }, error: null }),
            getSession: async () => ({ data: { session: null }, error: null }),
            signInWithPassword: async () => ({
              data: null,
              error: { message: "Supabase environment credentials not configured." },
            }),
            signOut: async () => ({ error: null }),
          };
        }
        if (prop === "from") {
          return () => ({
            select: () => ({
              order: () => Promise.resolve({ data: [], error: null }),
              eq: () => ({
                single: () => Promise.resolve({ data: null, error: null }),
                maybeSingle: () => Promise.resolve({ data: null, error: null }),
              }),
            }),
            insert: () => Promise.resolve({ data: null, error: null }),
            upsert: () => Promise.resolve({ data: null, error: null }),
            update: () => ({
              eq: () => Promise.resolve({ data: null, error: null }),
            }),
            delete: () => ({
              eq: () => Promise.resolve({ data: null, error: null }),
            }),
          });
        }
        return () => {};
      },
    }
  );
};

export const supabase: SupabaseClient = getSupabase();
