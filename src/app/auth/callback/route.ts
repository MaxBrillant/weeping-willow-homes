import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  console.log(requestUrl);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redi");
  const redirectUrl = redirectTo ? redirectTo : requestUrl.origin;

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(redirectUrl.replaceAll("!", "&"));
}
