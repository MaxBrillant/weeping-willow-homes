import { z } from "zod";

export const FilterParamsSchema = z
  .object({
    city: z.enum([
      "Nairobi, Kenya",
      "Mombasa, Kenya",
      "Kisumu, Kenya",
      "Nakuru, Kenya",
      "Nanyuki, Kenya",
      "Naivasha, Kenya",
      "Eldoret, Kenya",
      "Malindi, Kenya",
      "Tsavo, Kenya",
      "Watamu, Kenya",
      "Maasai Mara, Kenya",
    ]),
    startDate: z.date(),
    duration: z.number().max(12).min(1),
    currency: z.enum(["US Dollars", "Kenyan Shillings"]).optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    numberOfGuests: z.number().min(1).max(7).optional(),
    numberOfBedrooms: z.number().min(1).max(7).optional(),
    numberOfBeds: z.number().min(1).max(7).optional(),
    numberOfPrivateBathrooms: z.number().min(0).max(5).optional(),
    numberOfSharedBathrooms: z.number().min(1).max(5).optional(),
  })
  .refine(
    (data) => {
      // If minPrice is defined, maxPrice must also be defined
      if (data.minPrice !== undefined && data.maxPrice === undefined) {
        return false;
      }
      // If maxPrice is defined, minPrice must also be defined
      if (data.maxPrice !== undefined && data.minPrice === undefined) {
        return false;
      }
      // Both minPrice and maxPrice can be undefined together, so it's valid
      return true;
    },
    {
      message:
        "Both minPrice and maxPrice must be defined together or left undefined.",
      path: ["minPrice", "maxPrice"], // This specifies the path to the properties in the error message
    }
  );

export const BookingParamsSchema = z.object({
  guests: z.number().min(1).max(7).optional(),
  startDate: z.date().optional(),
  duration: z.number().min(1).max(12).optional(),
});
