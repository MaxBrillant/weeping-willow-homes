"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SignInButton from "../components/signInButton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col p-5 w-fit h-fit gap-3 items-center mx-auto">
      <p className="text-3xl font-bold">Welcome</p>
      <p>{`Let's reach new heights together.`}</p>
      <SignInButton />
    </div>
  );
}
