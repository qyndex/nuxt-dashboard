/**
 * Auth middleware -- protects routes that require authentication.
 * Apply to pages with: definePageMeta({ middleware: 'auth' })
 */
export default defineNuxtRouteMiddleware(async () => {
  const { user, loading } = useAuth();

  // Wait for auth to initialize on first load
  if (loading.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(loading, (val) => {
        if (!val) {
          unwatch();
          resolve();
        }
      });
      // Timeout after 3 seconds
      setTimeout(() => {
        unwatch();
        resolve();
      }, 3000);
    });
  }

  if (!user.value) {
    return navigateTo("/auth/login");
  }
});
