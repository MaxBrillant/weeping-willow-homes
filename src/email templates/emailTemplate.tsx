import { Container } from "@react-email/container";
import { Button } from "@react-email/button";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Img } from "@react-email/img";

type EmailTemplateProps = {
  profileLink: string;
  homeTitle: string;
  homeLink: string;
  type: "profile-creation" | "home-creation" | "home-completion";
};

export const EmailTemplate = (email: EmailTemplateProps) => {
  return (
    <div className="bg-yellow-400">
      {email.type === "profile-creation" ? (
        <Container>
          <Img
            src="https://dxtymkfjqltlvlpxcmia.supabase.co/storage/v1/object/public/home_photos/logo.png"
            alt="Logo"
            width="150"
            height="150"
          />
          <Heading>Your profile has been successfully updated</Heading>
          <Text>
            Your profile will be visible to anyone booking your homes, or to
            your hosts.
          </Text>
          <Button href={email.profileLink}>Check Your Profile</Button>
        </Container>
      ) : email.type === "home-creation" ? (
        <Container>
          <Img
            src="https://dxtymkfjqltlvlpxcmia.supabase.co/storage/v1/object/public/home_photos/logo.png"
            alt="Logo"
            width="150"
            height="150"
          />
          <Heading>
            You have successfully initiated a new Setup for the Home: &quot;
            {email.homeTitle}&quot;
          </Heading>
          <Text>
            You can track the progress of your Setup, and continue right where
            you left off.
          </Text>
          <Button href="https://www.willow.africa/hosting">Go To Setup</Button>
        </Container>
      ) : (
        <Container>
          <Img
            src="https://dxtymkfjqltlvlpxcmia.supabase.co/storage/v1/object/public/home_photos/logo.png"
            alt="Logo"
            width="150"
            height="150"
          />
          <Heading>You have successfully completed the Home Setup</Heading>
          <Text>
            You can go ahead and check your newly created Home and its
            information.
          </Text>
          <Button href={email.homeLink}>Go To Home</Button>
        </Container>
      )}
    </div>
  );
};
