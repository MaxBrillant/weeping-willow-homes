"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FcGoogle } from "react-icons/fc";

export default function SignInButton({ url }: { url: string }) {
  const handleSignIn = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          // prompt: "consent",
        },
        redirectTo: url,
      },
    });
  };
  return (
    <Button variant={"outline"} onClick={() => handleSignIn()}>
      <FcGoogle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}
