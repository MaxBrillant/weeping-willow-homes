import { NextRequest } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/email templates/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email, profileLink, homeTitle, homeLink } = body;

    const data = await resend.emails.send({
      from: "Willow Homes <support@willow.africa>",
      to: email,
      subject:
        type === "profile-creation"
          ? "Welcome to Willow Homes"
          : type === "home-creation"
          ? "Home Setup has been initiated"
          : "Home Setup completed",
      react: EmailTemplate({
        type: type,
        profileLink: profileLink,
        homeTitle: homeTitle,
        homeLink: homeLink,
      }),
      text: "",
    });

    console.log("Email has been successfully sent");
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error });
  }
}
