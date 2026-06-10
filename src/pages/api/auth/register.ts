// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabase-server";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { data, error } = await supabaseServer.auth.signUp({
    email,
    password,
    options: {
      // For development: you can disable email confirmation in Supabase dashboard
      emailRedirectTo: `${new URL(request.url).origin}/dashboard`,
    },
  });

  if (error) {
    // Provide more helpful error messages
    if (error.message.includes("rate limit")) {
      return new Response(
        "Too many registration attempts. Please wait a few minutes or check your email for a confirmation link from a previous attempt.",
        { status: 429 },
      );
    }
    return new Response(error.message, { status: 500 });
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    return new Response(
      "Registration successful! Please check your email to confirm your account.",
      { status: 200 },
    );
  }

  return redirect("/signin");
};
