export interface SupabaseEnv {
  url: string;
  key: string;
}

// Returns null when the public Supabase variables are missing so callers can
// keep their existing "not configured" behavior instead of asserting.
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return url && key ? { url, key } : null;
}
