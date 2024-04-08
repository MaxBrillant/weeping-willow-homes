"use server";

import { headers } from "next/headers";

type EmailProps = {
  email: string;
  profileLink: string;
  homeTitle: string;
  homeLink: string;
  type: "profile-creation" | "home-creation" | "home-completion";
};
export async function SendEmail(email: EmailProps) {
  const headersList = headers();
  const url = new URL(headersList.get("x-pathname") as string).origin + "/send";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: email.type,
      email: email.email,
      profileLink: email.profileLink,
      homeTitle: email.homeTitle,
      homeLink: email.homeLink,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  console.log(data);
}
