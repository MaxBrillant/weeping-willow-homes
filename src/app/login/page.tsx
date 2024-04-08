"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SignInButton from "../components/signInButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Login({ searchParams }: { searchParams: any }) {
  const { push } = useRouter();
  const [email, setEmail] = useState<string>("");
  const [open, setOpen] = useState(false);

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

  const supabase = createClientComponentClient();
  const handleSignedOutUser = async () => {
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
        <p className="text-xl font-semibold text-center">
          {`Before you continue, let's quickly get you logged in.`}
        </p>
        <Separator />
        <div className="flex flex-col gap-3">
          <p className="font-bold text-lg">Email address</p>
          <Input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            disabled={
              email.length < 7 || !email.includes("@") || email.includes(" ")
            }
            onClick={async () => {
              await supabase.auth
                .signInWithOtp({
                  email: email,
                  options: {
                    emailRedirectTo: redirectUrl
                      ? redirectUrl
                      : `${location.origin}`,
                  },
                })
                .then(
                  () => setOpen(true),
                  (reason) => console.log(reason)
                );
            }}
          >
            Continue
          </Button>
        </div>
        <div className="w-full flex flex-row gap-2 items-center justify-center">
          <Separator className="w-[40%]" />
          <p>Or</p>
          <Separator className="w-[40%]" />
        </div>
        <div className="mt-3">
          <SignInButton url={url} />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full h-full overflow-auto">
          <div className="flex flex-col gap-5 p-5 items-center justify-center">
            <p className="text-xl font-semibold text-center">
              We have sent a verification link to <h1>{email}</h1>, kindly
              check your mailbox
            </p>
            <p className="font-medium">
              {`You have not received any verification email?`}
            </p>
            <Button
              variant={"link"}
              onClick={async () => {
                await supabase.auth
                  .signInWithOtp({
                    email: email,
                    options: {
                      emailRedirectTo: redirectUrl
                        ? redirectUrl
                        : `${location.origin}/hosting`,
                    },
                  })
                  .then(
                    () => setOpen(true),
                    (reason) => console.log(reason)
                  );
              }}
            >
              Send again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
