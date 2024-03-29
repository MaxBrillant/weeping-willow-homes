import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
export const ProfileFormSchema = z.object({
  fullName: z
    .string()
    .min(7, "The name must have at least 7 characters")
    .max(50, "The name must must have a maximum of 50 characters"),
  bio: z
    .string()
    .min(20, "Your bio must have at least 20 characters")
    .max(500, "Your bio must have a maximum of 500 characters"),
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Please write a valid phone number"),
  emailAddress: z.string().email(),
  languages: z
    .array(
      z.union([z.literal("English"), z.literal("Swahili"), z.literal("French")])
    )
    .min(1, "Please choose one or more languages"),
  cityAddress: z
    .string()
    .min(5, "The city name must have at least 5 characters")
    .max(50, "The city name must have a maximum of 50 characters"),
  profilePhoto: z
    .string({ required_error: "Please take a profile picture" })
    .url("Please take a profile picture"),
});
