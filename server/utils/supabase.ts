import { createClient } from "@supabase/supabase-js";
import type { H3Event } from "h3";

/**
 * Create a Supabase client for server-side use.
 * Uses the service role key when available (bypasses RLS for admin operations),
 * otherwise falls back to the anon key.
 */
export function useSupabaseServer() {
  const config = useRuntimeConfig();
  return createClient(config.supabaseUrl || "http://localhost:54321", config.supabaseServiceKey || config.supabaseKey || "placeholder");
}

/**
 * Create a Supabase client scoped to the current user's auth context.
 * Reads the access token from the Authorization header and passes it
 * to the Supabase client so RLS policies apply.
 */
export function useSupabaseUser(event: H3Event) {
  const config = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization");
  const token = authHeader?.replace("Bearer ", "");

  const client = createClient(config.supabaseUrl || "http://localhost:54321", config.supabaseKey || "placeholder", {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });

  return client;
}

/**
 * Extract and verify the current user from the request.
 * Throws a 401 error if no valid user session exists.
 */
export async function requireAuth(event: H3Event) {
  const client = useSupabaseUser(event);
  const { data: { user }, error } = await client.auth.getUser();

  if (error || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  return { user, client };
}
