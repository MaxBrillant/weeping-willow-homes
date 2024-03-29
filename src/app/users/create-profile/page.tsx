"use client";
import ProfileForm from "@/app/profileForm/profileForm";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateProfile() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 w-full bg-white py-2">
        <div className="flex flex-row gap-5 py-3 border-b-2">
          <p className="font-bold text-xl">
            Before we continue, tell us a little bit about yourself
          </p>
        </div>
      </div>
      <div className="flex-grow flex flex-col items-center sm:px-10">
        <div id="step-1">
          <div
            id="profile"
            className="flex flex-col w-full border border-black mt-10"
          >
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
                      push("/");
                    }
                  } else {
                    push("/");
                  }
                },
              ]}
            />
          </div>
          <div className="m-auto h-10 w-1 bg-slate-500"></div>
        </div>
      </div>
    </div>
  );
}
