"use client";
import ProfileForm from "@/app/profileForm/profileForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateProfile() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const supabase = createClientComponentClient();
  return (
    <div className="flex-grow flex flex-col items-center sm:px-10 mx-5">
      <div>
        <div className="flex flex-col w-full border border-black mt-10 rounded-2xl">
          <p className="bg-slate-200 p-5 font-medium border-b border-black rounded-t-2xl">
            Before we continue, tell us a little bit about yourself
          </p>
          <ProfileForm
            submitFunctions={[
              () => {
                if (searchParams != undefined && searchParams) {
                  const path = searchParams.get("redirect-to");
                  if (path) {
                    push(
                      path
                        ?.replaceAll("!", "&")
                        .replace(new URL(path).origin, "")
                    );
                  } else {
                    push("/account");
                  }
                } else {
                  push("/account");
                }
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
