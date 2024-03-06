import { FilterParamsSchema } from "@/validation/paramValidation";
import { redirect } from "next/navigation";

export function getUrlSearchFilters(searchParams: any) {
  const params =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(searchParams);

  try {
    // Validate and parse the search parameters
    const paramsValidation = FilterParamsSchema.parse({
      city: params.get("city"),
      startDate: new Date(params.get("start-date") as string),
      duration: Number(params.get("duration")),
      currency: params.get("currency") || undefined,
      minPrice: params.get("min-price")
        ? Number(params.get("min-price"))
        : undefined,
      maxPrice: params.get("max-price")
        ? Number(params.get("max-price"))
        : undefined,
      numberOfGuests: params.get("guests")
        ? Number(params.get("guests"))
        : undefined,
      numberOfBedrooms: params.get("bedrooms")
        ? Number(params.get("bedrooms"))
        : undefined,
      numberOfBeds: params.get("beds") ? Number(params.get("beds")) : undefined,
      numberOfPrivateBathrooms: params.get("private-bathrooms")
        ? Number(params.get("private-bathrooms"))
        : undefined,
      numberOfSharedBathrooms: params.get("shared-bathrooms")
        ? Number(params.get("shared-bathrooms"))
        : undefined,
    });
  } catch (error) {
    // Handle validation errors, such as by redirecting to a  404 page
    // You can use next/router or react-router-dom's useHistory for redirection
    console.error("Validation failed", error);
    redirect("/");
  }

  let searchedCity = params.get("city")?.toString();
  const searchedDate = params.get("start-date")?.toString();
  const searchedDuration = Number(params.get("duration")?.toString());
  let currency = params.get("currency") || undefined;
  if (currency === "US Dollars") {
    currency = "usd";
  }
  if (currency === "Kenyan Shillings") {
    currency = "kes";
  }
  const minPrice = params.get("min-price")
    ? Number(params.get("min-price"))
    : undefined;
  const maxPrice = params.get("max-price")
    ? Number(params.get("max-price"))
    : undefined;
  const numberOfGuests = params.get("guests")
    ? Number(params.get("guests"))
    : undefined;
  const numberOfBedrooms = params.get("bedrooms")
    ? Number(params.get("bedrooms"))
    : undefined;
  const numberOfBeds = params.get("beds")
    ? Number(params.get("beds"))
    : undefined;
  const numberOfPrivateBathrooms = params.get("private-bathrooms")
    ? Number(params.get("private-bathrooms"))
    : undefined;
  const numberOfSharedBathrooms = params.get("shared-bathrooms")
    ? Number(params.get("shared-bathrooms"))
    : undefined;

  return {
    city: searchedCity,
    date: searchedDate,
    duration: searchedDuration,
    currency: currency,
    minPrice: minPrice,
    maxPrice: maxPrice,
    guests: numberOfGuests,
    bedrooms: numberOfBedrooms,
    beds: numberOfBeds,
    privateBathrooms: numberOfPrivateBathrooms,
    sharedBathrooms: numberOfSharedBathrooms,
  };
}
