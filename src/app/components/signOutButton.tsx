"use client";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    router.push("/");
  };
  return (
    <Button
      variant={"outline"}
      className="w-full"
      onClick={() => handleSignOut()}
    >
      Log out
    </Button>
  );
}
