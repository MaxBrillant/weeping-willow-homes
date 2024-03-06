import { z } from "zod";

export const PropertyFormSchema = z.object({
  title: z
    .string()
    .min(10, "The title must have at least 10 characters")
    .max(50, "The title must must have a maximum of 50 characters"),
  typeOfProperty: z.enum(["house", "apartment"]),
  description: z
    .string()
    .min(30, "The description must have at least 30 characters")
    .max(500, "The description must have a maximum of 500 characters"),
  size: z
    .number({
      invalid_type_error: "Please write a valid size",
    })
    .min(1, "The size must be greater than 1 square meter")
    .max(1000, "The size must be less than 1000 square meters")
    .optional(),
});

export const AccommodationFormSchema = z.object({
  numberOfGuests: z
    .number()
    .min(1, "The number of guests must be at least 1")
    .max(7, "The number of guests must not be more than 7"),
  numberOfBedrooms: z
    .number()
    .min(1, "The number of bedrooms must be at least 1")
    .max(7, "The number of bedrooms must not be more than 7"),
  numberOfBeds: z
    .number()
    .min(1, "The number of beds must be at least 1")
    .max(7, "The number of beds must not be more than 7"),
  numberOfPrivateBathrooms: z
    .number()
    .min(0, "The number of private bathrooms must be at least 1")
    .max(5, "The number of private bathrooms must not be more than 7"),
  numberOfSharedBathrooms: z
    .number()
    .min(1, "The number of shared bathrooms must be at least 1")
    .max(5, "The number of shared bathrooms must not be more than 7"),
});

export const LocationFormSchema = z
  .object({
    city: z.enum(["Nairobi, Kenya", "Mombasa, Kenya"]),
    streetAddress: z.string().min(20, "Write a complete address"),
    buildingName: z.string(),
    longitude: z.number(),
    latitude: z.number(),
  })
  .refine((data) => data.streetAddress.endsWith(data.city), {
    message: "The address must be from the selected city",
    path: ["streetAddress"],
  });

export const PhotosFormSchema = z.object({
  coverPhoto: z.string().url(),
  sleepingSpacePhotos: z
    .array(z.string().url())
    .min(2, "A minimum of 2 photos is required")
    .max(5, "You can only add a maximum of 5 photos"),
  livingSpacePhotos: z
    .array(z.string().url())
    .min(2, "A minimum of 2 photos is required")
    .max(5, "You can only add a maximum of 5 photos"),
  bathroomPhotos: z
    .array(z.string().url())
    .min(2, "A minimum of 2 photos is required")
    .max(5, "You can only add a maximum of 5 photos"),
  kitchenPhotos: z
    .array(z.string().url())
    .min(2, "A minimum of 2 photos is required")
    .max(5, "You can only add a maximum of 5 photos"),
  buildingPhotos: z
    .array(z.string().url())
    .min(1, "A minimum of 1 photo is required")
    .max(5, "You can only add a maximum of 5 photos"),
  outdoorsPhotos: z
    .array(z.string().url())
    .min(1, "A minimum of 1 photo is required")
    .max(5, "You can only add a maximum of 5 photos"),
  additionalPhotos: z
    .array(z.string().url())
    .min(0)
    .max(5, "You can only add a maximum of 5 photos"),
});

export const FacilitiesAndFeaturesFormSchema = z.object({
  facilities: z
    .array(z.string())
    .min(3, "You must select at least 3 facilities")
    .max(15, "You can select a maximum of 15 facilities"),
  safetyAndSecurity: z
    .array(z.string())
    .min(1, "You must select at least 1 facility")
    .max(5, "You can select a maximum of 5 facilities"),
  features: z
    .array(z.string())
    .min(2, "You must select at least 2 features")
    .max(3, "You can select a maximum of 3 features"),
});

export const FeesAndFinancesFormSchema = z.object({
  currency: z.enum(["usd", "kes"]),
  regularFees: z
    .number({
      invalid_type_error: "Please write a valid amount",
    })
    .nonnegative(),
  firstTimeFees: z
    .number({
      invalid_type_error: "Please write a valid amount",
    })
    .nonnegative(),
  firstTimeFeesDescription: z
    .string()
    .max(150, "The description must have a maximum of 150 characters")
    .optional(),
  bookingOption: z.enum(["instant", "request"]),
});

export const hours = z.enum([
  "12:00 AM",
  "1:00 AM",
  "2:00 AM",
  "3:00 AM",
  "4:00 AM",
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
]);
export const HouseRulesAndInformationFormSchema = z.object({
  eventsAllowed: z.boolean().optional(),
  petsAllowed: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),
  startOfQuietHours: hours.optional(),
  endOfQuietHours: hours.optional(),
  additionalRules: z
    .string()
    .max(300, "The additional rules must have a maximum of 300 characters")
    .optional(),
  houseInformation: z
    .string()
    .max(
      300,
      "The additional information must have a maximum of 300 characters"
    )
    .optional(),
});
