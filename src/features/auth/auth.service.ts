import { supabase } from "../../lib/supabase/client";

export function getAuthRedirectUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin).toString();
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
      data: {
        full_name: name.trim(),
      },
    },
  });
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function resendSignupEmail(email: string) {
  return supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
    },
  });
}

export async function requestPasswordReset(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getAuthRedirectUrl(),
  });
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({
    password,
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
