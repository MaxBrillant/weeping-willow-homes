// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  const url = new URL(req.url);
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", url.href);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/homes",
    "/stays",
    "/account",
    "/become-a-host",
    "/hosting",
    "/users",
  ],
};
