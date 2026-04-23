<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Sign In</h1>
      <p class="subtitle">Enter your credentials to access the dashboard.</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
            autocomplete="email"
            aria-label="Email address"
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Your password"
            required
            autocomplete="current-password"
            aria-label="Password"
          />
        </div>

        <div v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</div>

        <button type="submit" :disabled="submitting" class="submit-btn" aria-label="Sign in">
          {{ submitting ? "Signing in..." : "Sign In" }}
        </button>
      </form>

      <p class="switch-text">
        Don't have an account?
        <NuxtLink href="/auth/signup" class="link">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
useHead({ title: "Sign In — DataKit" });

const { login, user } = useAuth();

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const submitting = ref(false);

// Redirect if already logged in
watch(user, (val) => {
  if (val) navigateTo("/");
}, { immediate: true });

async function handleLogin() {
  errorMsg.value = "";
  submitting.value = true;
  try {
    await login(email.value, password.value);
    await navigateTo("/");
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : "Sign in failed. Check your credentials.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 1rem; }
.auth-card { background: white; border-radius: 0.75rem; padding: 2.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); width: 100%; max-width: 24rem; }
h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
.subtitle { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
.auth-form { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.375rem; }
label { font-size: 0.8125rem; font-weight: 600; color: #374151; }
input { padding: 0.625rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.875rem; }
input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.error { color: #dc2626; font-size: 0.8125rem; padding: 0.5rem 0.75rem; background: #fef2f2; border-radius: 0.375rem; }
.submit-btn { background: #1e40af; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.submit-btn:hover:not(:disabled) { background: #1e3a8a; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.switch-text { text-align: center; margin-top: 1.5rem; font-size: 0.8125rem; color: #64748b; }
.link { color: #1e40af; text-decoration: none; font-weight: 600; }
.link:hover { text-decoration: underline; }
</style>
