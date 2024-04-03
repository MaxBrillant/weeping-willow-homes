"use client";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN; // Your access token

type mapProps = {
  long: number;
  lat: number;
  scrollToZoom: boolean;
};
export default function Map(location: mapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapboxgl.accessToken = ACCESS_TOKEN as string;
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [location.long, location.lat],
        zoom: 15,
        scrollZoom: location.scrollToZoom,
        optimizeForTerrain: true,
      });
      setMap(newMap);

      const newMarker = new mapboxgl.Marker({ draggable: false })
        .setLngLat([location.long, location.lat])
        .addTo(newMap);
      setMarker(newMarker);
    }
  }, [location]);

  return (
    <div className="relative w-full h-full">
      {!location.scrollToZoom && (
        <div className="absolute right-0 flex flex-col gap-2 z-40 p-3">
          <Button
            variant={"secondary"}
            size={"icon"}
            className="text-3xl font-semibold"
            onClick={(e) => {
              e.preventDefault();
              map?.zoomIn();
            }}
          >
            +
          </Button>
          <Button
            variant={"secondary"}
            size={"icon"}
            className="text-3xl font-semibold"
            onClick={(e) => {
              e.preventDefault();
              map?.zoomOut();
            }}
          >
            -
          </Button>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full rounded-2xl"></div>
    </div>
  );
}

export function ExpandMap(map: { longitude: number; latitude: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="w-full">
          Expand map view
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen max-h-screen h-[90%] w-screen sm:w-[90%]">
        <div className="w-full h-full flex flex-col gap-5">
          <DialogTitle>Map view</DialogTitle>
          {open && <Map long={map.longitude} lat={map.latitude} scrollToZoom />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
