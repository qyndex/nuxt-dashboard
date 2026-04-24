import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { User, Session } from "@supabase/supabase-js";

// Singleton Supabase client — kept outside useState to avoid SSR serialization
let _supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(url: string, key: string): SupabaseClient {
  if (!_supabaseClient) {
    _supabaseClient = createClient(url || "http://localhost:54321", key || "placeholder");
  }
  return _supabaseClient;
}

/**
 * Client-side auth composable using Supabase Auth.
 * Provides reactive user/session state and auth methods.
 */
export function useAuth() {
  const config = useRuntimeConfig();
  const user = useState<User | null>("auth-user", () => null);
  const session = useState<Session | null>("auth-session", () => null);
  const loading = useState<boolean>("auth-loading", () => true);

  // Lazy-init the Supabase client (singleton, NOT in useState to avoid devalue crash)
  const supabase = { value: getSupabaseClient(config.public.supabaseUrl, config.public.supabaseKey) };

  /** Initialize auth -- call in app.vue or a plugin */
  async function init() {
    loading.value = true;
    try {
      const { data } = await supabase.value.auth.getSession();
      session.value = data.session;
      user.value = data.session?.user ?? null;

      // Listen for auth changes
      supabase.value.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession;
        user.value = newSession?.user ?? null;
      });
    } finally {
      loading.value = false;
    }
  }

  /** Sign in with email + password */
  async function login(email: string, password: string) {
    const { data, error } = await supabase.value.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  /** Sign up with email + password */
  async function signup(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.value.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
    return data;
  }

  /** Sign out */
  async function logout() {
    const { error } = await supabase.value.auth.signOut();
    if (error) throw error;
    user.value = null;
    session.value = null;
    await navigateTo("/");
  }

  /** Get the current access token for API calls */
  function getAccessToken(): string | null {
    return session.value?.access_token ?? null;
  }

  /** Make an authenticated fetch to the API */
  async function authFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await $fetch<T>(url, {
      ...options,
      headers,
    } as Parameters<typeof $fetch>[1]);
    return response;
  }

  return {
    user: readonly(user),
    session: readonly(session),
    loading: readonly(loading),
    supabase,
    init,
    login,
    signup,
    logout,
    getAccessToken,
    authFetch,
  };
}
