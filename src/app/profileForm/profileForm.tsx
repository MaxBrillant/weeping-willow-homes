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
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 p-5"
    >
      <SelfieCamera
        setProfilePhoto={setProfilePhoto}
        defaultPhoto={watch("profilePhoto")}
      ></SelfieCamera>
      {errors.profilePhoto && (
        <p className="text-red-500 font-semibold">
          {errors.profilePhoto.message}
        </p>
      )}
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Full name</p>
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

      <div className="flex flex-col">
        <p className="font-semibold text-lg">In which city do you live?</p>
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

      <div className="flex flex-col">
        <p className="font-semibold text-lg">Phone number</p>
        <p>
          Write your phone number including the country code. Please insure the
          phone number is valid as it will be used for later communication with
          hosts, guests, and us.
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
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Languages spoken</p>
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
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Bio</p>
        <p>Tell us about yourself, your hobbies, and some facts about you</p>
        <Textarea
          {...register("bio")}
          defaultValue={defaultValues?.bio}
          placeholder="This place offers a unique view of the city and its spendid mountains"
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
    </form>
  );
}
