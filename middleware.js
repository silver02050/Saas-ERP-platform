import { NextRequest, NextResponse } from "next/server";
import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(300, "60 s"),
});

export const config = {
  matcher: [
    "/((?!privacy-policy|_next/static|_next/image|favicon.ico|$).*)", //this protect api routes
    "/api/auth/:path*", // Allow api route that responsible for auth
    // '/((?!api|privacy-policy|_next/static|_next/image|favicon.ico|$).*)', //This doesn't protect api routes
  ],
};

export async function middleware(req, res) {
  console.log("💂💂Middleware");
  return NextResponse.next();
}

export default withMiddlewareAuthRequired();
