"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import CkEditor from "@/components/ck-editor";
import EditorCard from "@/components/editor-card";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FormSchema } from "./product-editor";

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY!;

export default function LocationFields() {
  const { setValue, watch } = useFormContext();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const mapInitializedRef = useRef(false);

  const lat = watch("latitude");
  const lng = watch("longitude");
  const location = watch("location");

  const [query, setQuery] = useState(location || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- Init Map (only once) ---
  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapInitializedRef.current)
      return;

    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      mapInitializedRef.current = true;

      const initialLat = lat ? Number(lat) : 27.7172;
      const initialLng = lng ? Number(lng) : 85.324;

      try {
        mapRef.current = new maplibregl.Map({
          container: mapContainerRef.current,
          style: `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${GEOAPIFY_API_KEY}`,
          center: [initialLng, initialLat],
          zoom: 12,
        } as maplibregl.MapOptions);

        mapRef.current.on("load", () => {
          if (
            lat !== null &&
            lat !== undefined &&
            lng !== null &&
            lng !== undefined
          ) {
            markerRef.current = new maplibregl.Marker({ color: "#ff0000" })
              .setLngLat([Number(lng), Number(lat)])
              .addTo(mapRef.current!);
          }
        });

        mapRef.current.on("click", (e) => {
          const { lng: clickLng, lat: clickLat } = e.lngLat;

          const roundedLat = Math.round(clickLat * 10000) / 10000;
          const roundedLng = Math.round(clickLng * 10000) / 10000;

          setValue("latitude", roundedLat);
          setValue("longitude", roundedLng);
          setValue("location", "");
          setQuery("");

          if (!markerRef.current) {
            markerRef.current = new maplibregl.Marker({ color: "#ff0000" })
              .setLngLat([roundedLng, roundedLat])
              .addTo(mapRef.current!);
          } else {
            markerRef.current.setLngLat([roundedLng, roundedLat]);
          }
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        mapInitializedRef.current = false;
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      mapInitializedRef.current = false;
    };
  }, [isClient]);

  // Update marker when lat/lng change from form
  useEffect(() => {
    if (!mapRef.current || !lat || !lng || !mapInitializedRef.current) return;

    const numLat = Number(lat);
    const numLng = Number(lng);

    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({ color: "#ff0000" })
        .setLngLat([numLng, numLat])
        .addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat([numLng, numLat]);
    }

    if (mapRef.current.isStyleLoaded()) {
      mapRef.current.panTo([numLng, numLat], { duration: 0 });
    }
  }, [lat, lng]);

  // --- Close dropdown on outside click ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("input")
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Search Location ---
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsDropdownVisible(false);
      return;
    }

    setIsDropdownVisible(true);

    const timeout = setTimeout(async () => {
      try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&limit=6&apiKey=${GEOAPIFY_API_KEY}`;

        console.log("Fetching suggestions from:", url);

        const res = await fetch(url);

        console.log("Geoapify Response Status:", res.status, res.statusText);

        if (!res.ok) {
          console.error(`Geoapify API Error: ${res.status} ${res.statusText}`);
          const errorData = await res.text();
          console.error("Error Response Body:", errorData);
          setSuggestions([]);
          return;
        }

        const data = await res.json();
        console.log("Geoapify Suggestions:", data);

        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message);
        }
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelectSuggestion = (item: any) => {
    try {
      const rawLat = item.properties.lat;
      const rawLng = item.properties.lon;

      const formatted = item.properties.formatted || "";
      const locationName =
        item.properties.name || formatted.split(",")[0] || formatted;

      const selectedLat = Math.round(parseFloat(rawLat) * 10000) / 10000;
      const selectedLng = Math.round(parseFloat(rawLng) * 10000) / 10000;

      console.log("Raw values from Geoapify:", {
        lat: rawLat,
        lng: rawLng,
        latType: typeof rawLat,
        lngType: typeof rawLng,
      });

      console.log("After rounding:", {
        lat: selectedLat,
        lng: selectedLng,
        latType: typeof selectedLat,
        lngType: typeof selectedLng,
      });

      console.log("Selected Location:", {
        lat: selectedLat,
        lng: selectedLng,
        location: locationName,
      });

      setValue("latitude", selectedLat);
      setValue("longitude", selectedLng);
      setValue("location", locationName);

      setQuery(formatted);
      setIsDropdownVisible(false);
      setSuggestions([]);

      if (mapRef.current && mapRef.current.isStyleLoaded()) {
        mapRef.current.flyTo({
          center: [selectedLng, selectedLat],
          zoom: 15,
          duration: 1200,
        });
      }

      if (!markerRef.current && mapRef.current) {
        markerRef.current = new maplibregl.Marker({ color: "#ff0000" })
          .setLngLat([selectedLng, selectedLat])
          .addTo(mapRef.current);
      } else if (markerRef.current) {
        markerRef.current.setLngLat([selectedLng, selectedLat]);
      }
    } catch (error) {
      console.error("Error selecting suggestion:", error);
    }
  };

  const form = useFormContext<FormSchema>();
  const howToGet = form.watch("how_to_get");

  if (!isClient) {
    return <div className="space-y-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="relative">
        <label className="text-sm font-medium text-white block mb-2">
          Search Location
        </label>
        <input
          type="text"
          placeholder="Search location…"
          className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-black placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsDropdownVisible(true)}
        />

        {isDropdownVisible && suggestions.length > 0 && (
          <ul
            ref={dropdownRef}
            className="absolute z-20 mt-1 w-full bg-white border border-gray-300 text-black shadow-lg rounded-md max-h-56 overflow-auto transition-opacity duration-200"
          >
            {suggestions.map((item, idx) => (
              <li
                key={item.properties.place_id || idx}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                onClick={() => handleSelectSuggestion(item)}
              >
                <div className="text-sm font-medium text-gray-900">
                  {item.properties.formatted}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Lat/Lng Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-white block mb-1">
            Latitude
          </label>
          <input
            type="text"
            readOnly
            value={
              lat !== null && lat !== undefined ? Number(lat).toFixed(4) : ""
            }
            className="w-full border border-gray-300 px-3 py-2 bg-gray-50 text-black rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-white block mb-1">
            Longitude
          </label>
          <input
            type="text"
            readOnly
            value={
              lng !== null && lng !== undefined ? Number(lng).toFixed(4) : ""
            }
            className="w-full border border-gray-300 px-3 py-2 bg-gray-50 text-black rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Map */}
      <div
        ref={mapContainerRef}
        className="w-full h-[350px] rounded-md overflow-hidden shadow-lg transition-shadow hover:shadow-xl"
        style={{ minHeight: "350px" }}
      />

      <EditorCard title="How to get here">
        <FormField
          control={form.control}
          name="how_to_get"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CkEditor
                  id="how_to_get"
                  initialData={howToGet}
                  onChange={(content) => {
                    form.setValue("how_to_get", content);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </div>
  );
}
