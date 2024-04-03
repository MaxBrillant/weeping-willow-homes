"use client";
import mapboxgl from "mapbox-gl";
import { Dispatch, SetStateAction, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN; // Your access token

type mapProps = {
  long: number;
  lat: number;
  setLocationFunction: Dispatch<SetStateAction<number[]>>;
};
export default function LocationSelection(location: mapProps) {
  let map: mapboxgl.Map;
  let marker: mapboxgl.Marker;

  useEffect(() => {
    if (!map) {
      mapboxgl.accessToken = ACCESS_TOKEN as string; // Your access token

      map = new mapboxgl.Map({
        container: "my-map",
        style: "mapbox://styles/mapbox/dark-v11",
        center: [location.long, location.lat],
        zoom: 15,
        optimizeForTerrain: true,
      });

      // Add a draggable marker
      marker = new mapboxgl.Marker({ draggable: false })
        .setLngLat([location.long, location.lat])
        .addTo(map);

      // Update state when marker is moved
      map.on("drag", function () {
        marker.setLngLat([map.getCenter().lng, map.getCenter().lat]);
        location.setLocationFunction([
          map.getCenter().lng,
          map.getCenter().lat,
        ]);
        // Here you can update your state with the new coordinates
      });
    } else {
      if (marker) {
        marker.remove();
      }

      // Add a draggable marker
      marker = new mapboxgl.Marker({ draggable: false })
        .setLngLat([location.long, location.lat])
        .addTo(map);

      // Update state when marker is moved
      map.on("drag", function () {
        marker.setLngLat([map.getCenter().lng, map.getCenter().lat]);
        location.setLocationFunction([
          map.getCenter().lng,
          map.getCenter().lat,
        ]);
        // Here you can update your state with the new coordinates
      });
    }
  }, [location.long, location.lat]);

  return <div id="my-map" className="w-full h-full rounded-2xl"></div>;
}
