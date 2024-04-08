"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import OptionContainer from "../components/optionContainer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SelfieCamera from "../components/camera";
import { ProfileFormSchema } from "@/validation/userProfileValidation";
import getUserProfileDefaultValues from "@/api/defaultValues/userProfileForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CreateOrUpdateUserProfile } from "@/api/mutations/createOrUpdateUserProfile";
import { Separator } from "@/components/ui/separator";
import Loading from "../loading";
import { SendEmail } from "@/email templates/sendEmail";

type schema = z.infer<typeof ProfileFormSchema>;

type formProps = {
  submitFunctions: (() => void | undefined)[];
};
type defaultValuesType = {
  fullName: string;
  cityAddress: string;
  phoneNumber: string;
  bio: string;
  profilePhoto: string;
};

export default function ProfileForm(form: formProps) {
  const [defaultValues, setDefaultValues] = useState<
    defaultValuesType | undefined
  >();
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<Blob>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(ProfileFormSchema),
    mode: "onChange",
  });

  const supabase = createClientComponentClient();
  const handleSignedOutUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      push("/");
    }
  };

  useEffect(() => {
    handleSignedOutUser();
    const getUserEmail = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setValue("emailAddress", session?.user.email as string);
    };
    getUserEmail();
    const getDefaultValues = async () => {
      setIsLoading(true);
      const values = await getUserProfileDefaultValues();
      if (values) {
        setDefaultValues({
          fullName: values.fullName,
          cityAddress: values.cityAddress,
          phoneNumber: values.phoneNumber,
          bio: values.bio,
          profilePhoto: values.profilePicture,
        });
        setSelectedLanguages([]);
        if (values.languages.includes("English")) {
          setSelectedLanguages((selected) => [...selected, 0]);
        }
        if (values.languages.includes("Swahili")) {
          setSelectedLanguages((selected) => [...selected, 1]);
        }
        if (values.languages.includes("French")) {
          setSelectedLanguages((selected) => [...selected, 2]);
        }
        setValue("profilePhoto", values.profilePicture);
      } else {
        setDefaultValues(undefined);
      }
      setIsLoading(false);
    };

    getDefaultValues();
  }, [form]);

  useEffect(() => {
    if (selectedLanguages.length > 0) {
      setValue(
        "languages",
        selectedLanguages.map((language) => {
          if (language === 0) {
            return "English";
          } else if (language === 1) {
            return "Swahili";
          } else {
            return "French";
          }
        })
      );
    } else {
      setValue("languages", []);
    }
  }, [selectedLanguages]);

  useEffect(() => {
    if (profilePhoto != undefined) {
      setValue("profilePhoto", URL.createObjectURL(profilePhoto));
    }
  }, [profilePhoto]);

  const onSubmit = async (data: schema) => {
    setIsSubmitting(true);

    const formData = new FormData();
    if (profilePhoto != undefined) {
      formData.append("files", profilePhoto);
    }

    let photoToDelete = null;
    if (defaultValues != undefined && !data.profilePhoto.includes("supabase")) {
      photoToDelete = defaultValues.profilePhoto;
    } else {
      photoToDelete = null;
    }

    await CreateOrUpdateUserProfile({
      fullName: data.fullName,
      cityAddress: data.cityAddress,
      phoneNumber: data.phoneNumber,
      emailAddress: data.emailAddress,
      bio: data.bio,
      languages: data.languages,
      profilePicture: data.profilePhoto,
      newProfilePicture: profilePhoto != undefined ? formData : undefined,
      profilePictureToDelete: photoToDelete,
    });
    form.submitFunctions.map((submitFunction: () => void) => {
      submitFunction();
    });

    await SendEmail({
      type: "profile-creation",
      email: (await supabase.auth.getUser()).data.user?.email as string,
      profileLink: "https://www.willow.africa/account",
      homeTitle: "",
      homeLink: "",
    });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-7">
      <SelfieCamera
        setProfilePhoto={setProfilePhoto}
        defaultPhoto={watch("profilePhoto")}
      ></SelfieCamera>
      {errors.profilePhoto && (
        <p className="text-red-500 font-semibold">
          {errors.profilePhoto.message}
        </p>
      )}
      <Separator />
      <div className="flex flex-col gap-1">
        <p className="font-bold text-lg">Full name</p>
        <Input
          {...register("fullName")}
          defaultValue={defaultValues?.fullName}
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-red-500 font-semibold">
            {errors.fullName.message}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Phone number</p>
        <p className="font-normal text-sm">
          Provide your phone number, including the country code. Please ensure
          the phone number is valid, as it will be used for future
          communications with hosts, guests, and our team.
        </p>
        <Input
          {...register("phoneNumber")}
          defaultValue={defaultValues?.phoneNumber}
          placeholder="+254 XXXXXXXXXX"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 font-semibold">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-1">
        <p className="font-bold text-lg">
          What city/town are you currently living in?
        </p>
        <Input
          {...register("cityAddress")}
          defaultValue={defaultValues?.cityAddress}
          placeholder="Nairobi"
        />
        {errors.cityAddress && (
          <p className="text-red-500 font-semibold">
            {errors.cityAddress.message}
          </p>
        )}
      </div>

      <Separator />
      <div className="flex flex-col gap-1">
        <p className="font-bold text-lg">What languages are you fluent in?</p>
        <OptionContainer
          options={["English", "Swahili", "French"]}
          multipleSelectionEnabled={true}
          selectedOptions={selectedLanguages}
          setSelectedOptions={setSelectedLanguages}
        />
        {errors.languages && (
          <p className="text-red-500 font-semibold">
            {errors.languages.message}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Bio</p>
        <p className="font-normal text-sm">
          Share a bit about your background, your interests, and some
          interesting facts about yourself.
        </p>
        <Textarea
          {...register("bio")}
          defaultValue={defaultValues?.bio}
          placeholder="I like travelling and my favourite outdoor activity is hiking"
        />
        <p
          className={
            watch("bio")?.length > 500 ? "text-red-500 font-semibold" : ""
          }
        >
          {watch("bio") ? watch("bio").length : 0}/{500}
        </p>
        {errors.bio && (
          <p className="text-red-500 font-semibold">{errors.bio.message}</p>
        )}
      </div>
      <div className="w-full flex flex-row gap-3 justify-end p-3">
        <Button type="submit" disabled={isSubmitting}>
          Save and continue
        </Button>
      </div>
      {Object.keys(errors).length > 0 && (
        <p className="text-red-500 font-medium animate-pulse mt-[-2rem] mx-auto">
          Fill out all required details to proceed
        </p>
      )}
    </form>
  );
}
