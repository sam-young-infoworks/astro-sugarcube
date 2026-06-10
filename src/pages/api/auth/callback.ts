import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const authCode = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  // Check if OAuth provider returned an error
  if (error) {
    const message = errorDescription || error;
    console.error("OAuth error:", error, errorDescription);
    return redirect(`/signin?error=${encodeURIComponent(message)}`);
  }

  if (!authCode) {
    console.error("No code or error in callback URL");
    return redirect("/signin?error=Authentication failed - no code received");
  }

  const { data, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(authCode);

  if (exchangeError) {
    console.error("Session exchange error:", exchangeError);
    console.error(
      "Full error details:",
      JSON.stringify(exchangeError, null, 2),
    );

    // Provide more helpful error message
    let errorMsg = exchangeError.message;
    if (errorMsg.includes("external provider")) {
      errorMsg +=
        " - Check that GitHub OAuth app has correct permissions and email access enabled.";
    }

    return redirect(`/signin?error=${encodeURIComponent(errorMsg)}`);
  }

  const { access_token, refresh_token } = data.session;

  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });

  return redirect("/dashboard");
};
