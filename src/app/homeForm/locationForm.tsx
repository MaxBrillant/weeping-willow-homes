"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LocationFormSchema } from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Autocomplete from "react-google-autocomplete";
import { useEffect, useRef, useState } from "react";
import OptionContainer from "../components/optionContainer";
import { Input } from "@/components/ui/input";
import LocationSelection from "../components/locationSelection";
import Map from "../components/map";
import { setKey, fromAddress, fromLatLng } from "react-geocode";
import getLocationInformationDefaultValues from "@/api/defaultValues/locationForm";
import { addOrUpdateLocationInformation } from "@/api/mutations/locationMutations";

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

type schema = z.infer<typeof LocationFormSchema>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
  homeId: number | null;
};

type defaultValuesType = {
  locationId: number;
  streetAddress: string;
  buildingName: string;
};
export default function LocationForm(form: formProps) {
  const [defaultValues, setDefaultValues] = useState<
    defaultValuesType | undefined
  >();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(LocationFormSchema),
    mode: "onSubmit",
  });

  const [selectedCity, setSelectedCity] = useState<number[]>([]);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [addressNotFound, setAddressNotFound] = useState(false);
  const liveAddressRef = useRef<HTMLInputElement>(null);
  const [coordinates, setCoordinates] = useState<number[]>([0, 0]);
  const [adjustedCoordinates, setAdjustedCoordinates] = useState<number[]>([]);
  const [isAdjustingMap, setIsAdjustingMap] = useState(false);
  setKey(GOOGLE_MAPS_KEY as string);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getDefaultValues = async () => {
      if (form.homeId) {
        setIsLoading(true);
        const values = await getLocationInformationDefaultValues(form.homeId);
        if (values) {
          setDefaultValues({
            locationId: values.locationId,
            streetAddress: values.streetAddress,
            buildingName: values.buildingName,
          });
          setValue("streetAddress", values.streetAddress);
          if (values.city === "Nairobi, Kenya") {
            setSelectedCity([0]);
          } else if (values.city === "Mombasa, Kenya") {
            setSelectedCity([1]);
          }
          setTimeout(function () {
            setCoordinates([values.longitude, values.latitude]);
            setIsMapVisible(true);
          }, 1000);
        } else {
          setDefaultValues(undefined);
        }
        setIsLoading(false);
      } else {
        setDefaultValues(undefined);
        setIsLoading(false);
      }
    };

    getDefaultValues();
  }, [form.homeId]);

  useEffect(() => {
    if (selectedCity.length > 0) {
      setValue(
        "city",
        selectedCity[0] === 0 ? "Nairobi, Kenya" : "Mombasa, Kenya"
      );
      isMapVisible && setIsMapVisible(false);
      coordinates[0] !== 0 && coordinates[1] !== 0 && setCoordinates([0, 0]);
    }
  }, [selectedCity]);

  useEffect(() => {
    setValue("longitude", coordinates[0]);
    setValue("latitude", coordinates[1]);
  }, [coordinates]);

  const onSubmit = async (data: schema) => {
    setIsSubmitting(true);
    if (coordinates[0] !== 0 && coordinates[1] !== 0) {
      if (defaultValues == undefined) {
        await addOrUpdateLocationInformation({
          locationId: null,
          homeId: form.homeId as number,
          city: data.city,
          longitude: data.longitude,
          latitude: data.latitude,
          streetAddress: data.streetAddress,
          buildingName: data.buildingName,
        });
      } else {
        await addOrUpdateLocationInformation({
          locationId: defaultValues.locationId,
          homeId: form.homeId as number,
          city: data.city,
          longitude: data.longitude,
          latitude: data.latitude,
          streetAddress: data.streetAddress,
          buildingName: data.buildingName,
        });
      }
      form.submitFunctions.map((submitFunction: () => void) => {
        submitFunction();
      });
    } else {
      fromAddress(watch("buildingName") + ", " + watch("streetAddress"))
        .then(({ results }) => {
          const { lat, lng } = results[0].geometry.location;
          setCoordinates([lng, lat]);
          console.log([lng, lat]);
          setIsMapVisible(true);
        })
        .catch(() => setAddressNotFound(true));
    }
    setIsSubmitting(false);
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        isMapVisible && setIsMapVisible(false);
        coordinates[0] !== 0 && coordinates[1] !== 0 && setCoordinates([0, 0]);

        fromLatLng(position.coords.latitude, position.coords.longitude)
          .then(({ results }) => {
            setValue("streetAddress", results[0].formatted_address);
            if (liveAddressRef.current) {
              liveAddressRef.current.value = results[0].formatted_address;
            }
          })
          .catch(() => setAddressNotFound(true));
      },
      (error) => {
        console.log("Error occurred. Error code: " + error.code);
      }
    );
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 p-5"
    >
      <Button
        variant={"outline"}
        onClick={(e) => {
          e.preventDefault();
          getUserLocation();
        }}
      >
        Use your current location
      </Button>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">City</p>
        <OptionContainer
          options={["Nairobi", "Mombasa"]}
          multipleSelectionEnabled={false}
          selectedOptions={selectedCity}
          setSelectedOptions={setSelectedCity}
        />
        {errors.city && (
          <p className="text-red-500 font-semibold">{errors.city.message}</p>
        )}
      </div>
      <div>
        <p className="font-semibold text-lg">Street address</p>
        <Autocomplete
          ref={liveAddressRef}
          apiKey={GOOGLE_MAPS_KEY as string}
          options={{
            types: [
              "route",
              // "locality", "sublocality", "neighborhood"
            ],
            componentRestrictions: {
              country: "ke",
            },
          }}
          onPlaceSelected={(place) => {
            setValue("streetAddress", place.formatted_address);
          }}
          onChange={() => {
            isMapVisible && setIsMapVisible(false);
            coordinates[0] !== 0 &&
              coordinates[1] !== 0 &&
              setCoordinates([0, 0]);
          }}
          defaultValue={defaultValues?.streetAddress}
        />
        {errors.streetAddress && (
          <p className="text-red-500 font-semibold">
            {errors.streetAddress.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Building name</p>
        <Input
          {...register("buildingName")}
          placeholder="Luxurious 4 bedroom apartment"
          onChange={() => {
            if (isMapVisible) {
              isMapVisible && setIsMapVisible(false);
              coordinates[0] !== 0 &&
                coordinates[1] !== 0 &&
                setCoordinates([0, 0]);
            }
          }}
          defaultValue={defaultValues?.buildingName}
        />
        {errors.buildingName && (
          <p className="text-red-500 font-semibold">
            {errors.buildingName.message}
          </p>
        )}
      </div>

      {addressNotFound && (
        <p className="text-red-500 font-semibold">
          The address that you provided is not accurate enough. Try again with a
          different address. If the problem persists, provide a popular street
          or place near your home
        </p>
      )}
      {!isMapVisible && <Button type="submit">See map</Button>}
      {isMapVisible && (
        <div>
          <p className="font-semibold text-lg">Location on the map</p>
          {isAdjustingMap ? (
            <div className="relative">
              <div className="flex flex-col w-full aspect-[4/3]">
                <LocationSelection
                  long={coordinates[0]}
                  lat={coordinates[1]}
                  setLocationFunction={setAdjustedCoordinates}
                />
              </div>
              <Button
                variant={"secondary"}
                className="absolute z-30 bottom-1 right-2"
                onClick={(e) => {
                  e.preventDefault();
                  setIsAdjustingMap(false);
                  setCoordinates(adjustedCoordinates);
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="flex flex-col w-full aspect-[4/3]">
                <Map long={coordinates[0]} lat={coordinates[1]} />
              </div>
              <Button
                variant={"secondary"}
                className="absolute z-30 bottom-1 right-2"
                onClick={(e) => {
                  e.preventDefault();
                  setIsAdjustingMap(true);
                }}
              >
                Adjust
              </Button>
            </div>
          )}
        </div>
      )}
      <div className="w-full flex flex-row gap-3 justify-end p-3">
        <Button
          variant={"outline"}
          onClick={() =>
            form.backFunctions.map((backFunction: () => void) => {
              backFunction();
            })
          }
        >
          Back
        </Button>

        {isMapVisible && (
          <Button type="submit" disabled={isSubmitting}>
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
