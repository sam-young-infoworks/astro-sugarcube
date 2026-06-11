import { auth } from "./lib/auth"; // import your Better Auth instance
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  // if (isAuthed) {
  //   (context.locals as any).user = isAuthed.user;
  //   (context.locals as any).session = isAuthed.session;
  // } else {
  //   (context.locals as any).user = null;
  //   (context.locals as any).session = null;
  // }

  if (context.url.pathname === "/dashboard" && !isAuthed) {
    return context.redirect("/");
  }

  return next();
});
