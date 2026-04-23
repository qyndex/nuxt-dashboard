// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  typescript: { strict: true },

  runtimeConfig: {
    // Server-only (not exposed to client)
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseKey: process.env.SUPABASE_KEY || "",
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || "",

    // Client-accessible
    public: {
      apiBase: "/api",
      supabaseUrl: process.env.SUPABASE_URL || "",
      supabaseKey: process.env.SUPABASE_KEY || "",
    },
  },
});
