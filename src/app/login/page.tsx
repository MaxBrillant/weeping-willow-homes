"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SignInButton from "../components/signInButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function Login({ searchParams }: { searchParams: any }) {
  const { push } = useRouter();

  const params =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(searchParams);
  const redirectUrl = params.get("redirect-to");

  let url = "";
  console.log(redirectUrl);
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
    <div className="w-screen h-screen grid place-items-center p-10">
      <div className="flex flex-col p-7 w-fit h-fit gap-7 items-center bg-white drop-shadow-2xl rounded-3xl">
        <Image
          src="/logo.png"
          alt="logo"
          width={100}
          height={100}
          className="h-fit aspect-square object-cover border border-black rounded-full"
        />
        <p className="text-3xl font-bold text-center">
          {`Before you continue, let's quickly get you logged in.`}
        </p>
        <SignInButton url={url} />
      </div>
    </div>
  );
}
