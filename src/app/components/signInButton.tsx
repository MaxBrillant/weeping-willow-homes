"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function SignInButton() {
  const router = useRouter();
  const originUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const handleSignIn = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: originUrl + "/auth/callback",
      },
    });
    router.refresh();
  };
  return <Button onClick={() => handleSignIn()}>Sign in with Google</Button>;
}
