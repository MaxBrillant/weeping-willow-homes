import getUserProfile from "@/api/fetch/fetchUserProfile";
import BackButton from "@/app/components/backButton";
import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Profile({
  params,
}: {
  params: { userId: number };
}) {
  const stayId = params.userId;

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const activeUserId = (await supabase.auth.getUser()).data.user?.id;

  const userProfile = await getUserProfile(supabase, stayId);

  const formatLanguages = (languages: string[]): string => {
    if (languages.length === 1) {
      return `Speaks ${languages[0]}`;
    } else if (languages.length === 2) {
      return `Speaks ${languages[0]} and ${languages[1]}`;
    } else {
      // For three or more languages, join all except the last one with a comma, and then add "and" before the last one
      const lastLanguage = languages.pop();
      return `Speaks ${languages.join(", ")} and ${lastLanguage}`;
    }
  };

  if (userProfile == undefined) {
    return (
      <>
        <BackButton />
        <div className="flex flex-col gap-5 p-3 items-center">
          <p>This user doesn't exist.</p>
          <Link href={"/"}>
            <Button>Search for homes</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <BackButton />
      <div className="flex flex-col gap-5 p-5">
        <div className="w-full flex flex-col gap-5 p-7 rounded-3xl bg-white drop-shadow-2xl">
          <Image
            src={userProfile.profilePicture}
            width={150}
            height={150}
            alt="Profile picture"
            className="aspect-square object-cover rounded-full"
          />
          <div>
            <p className="font-semibold text-lg">{userProfile.fullName}</p>
            <p>{userProfile.bio}</p>
          </div>
        </div>
        <div>
          <p>Lives in {userProfile.cityAddress}</p>
          <p>{formatLanguages(userProfile.languages)}</p>
          {userProfile.isIdentityVerified && (
            <p className="font-semibold">
              This user's identity has been verified
            </p>
          )}
          {activeUserId && activeUserId === userProfile.userId && (
            <Button variant={"outline"} className="mt-5">
              Edit profile
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
