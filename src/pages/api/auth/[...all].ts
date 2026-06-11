import { auth } from "../../../lib/auth"; // import your Better Auth instance
import type { APIRoute } from "astro";

export const prerender = false; // Not needed in 'server' mode

export const GET: APIRoute = async (ctx) => {
  return auth.handler(ctx.request);
};

export const ALL: APIRoute = async (ctx) => {
  // If you want to use rate limiting, make sure to set the 'x-forwarded-for' header to the request headers from the context
  // ctx.request.headers.set("x-forwarded-for", ctx.clientAddress);
  return auth.handler(ctx.request);
};
