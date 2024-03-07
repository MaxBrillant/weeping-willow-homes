"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SignInButton from "../components/signInButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login({ searchParams }: { searchParams: any }) {
  const { push } = useRouter();

  const params =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(searchParams);
  const redirectUrl = params.get("redirect-to");

  let url = "";

  if (redirectUrl) {
    url = `${location.origin}/auth/callback?redi=${redirectUrl}`;
  } else {
    url = `${location.origin}/auth/callback`;
  }
  console.log(url);

  const handleSignedOutUser = async () => {
    const supabase = createClientComponentClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      push("/");
    }
  };

  useEffect(() => {
    handleSignedOutUser();
  }, []);

  return (
    <div className="flex flex-col p-5 w-fit h-fit gap-3 items-center mx-auto">
      <p className="text-3xl font-bold">Welcome</p>
      <p>{`Let's reach new heights together.`}</p>
      <SignInButton url={url} />
    </div>
  );
}
