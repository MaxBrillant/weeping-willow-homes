"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function SignInButton() {
  const router = useRouter();

  const handleSignIn = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          // access_type: "offline",
          prompt: "consent",
        },
        redirectTo: window.location.origin + "/auth/callback",
      },
    });
  };
  return <Button onClick={() => handleSignIn()}>Sign in with Google</Button>;
}
