"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignInButton({ url }: { url: string }) {
  console.log(url);
  const handleSignIn = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: url,
      },
    });
    // router.refresh();
  };
  return <Button onClick={() => handleSignIn()}>Sign in with Google</Button>;
}
