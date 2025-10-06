"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { formatDateAndTime } from "@/utils/formatter";
import { Radiation, Wind } from "lucide-react";
import React, { useEffect } from "react";
import useSWRMutation from "swr/mutation";
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

async function fetchAirQuality(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!res.ok) throw new Error("Error al consultar la API de Google");
  return res.json();
}

export const AirQuality = () => {
  const location = useGeolocation();
  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/air-quality/current-conditions",
    fetchAirQuality
  );

  const handleCheckAirQuality = async () => {
    await trigger({
      location: {
        latitude: -14.049772786847141,
        longitude: -75.75019562271035,
      },
    });
  };

  useEffect(() => {
    if (location) {
      handleCheckAirQuality();
    }
  }, []);

  if (error) return <div>failed to load</div>;

  if (isMutating)
    return (
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-2">
              <Skeleton className="h-8 w-3/4" />
            </h2>
            <div className="text-7xl font-bold inline-flex gap-4 items-center relative">
              <Skeleton className="h-20 w-20" />
              <div className="gap-4 flex flex-col">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div>
                <Skeleton className="h-4 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-2">
              <Skeleton className="h-8 w-3/4" />
            </h2>
            <div className="text-7xl font-bold inline-flex gap-4 items-center relative">
              <Skeleton className="h-20 w-20" />
              <div className="gap-4 flex flex-col">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div>
                <Skeleton className="h-4 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  if (data) {
    const color = rgbToHex(
      data.indexes[0].color.red,
      data.indexes[0].color.green,
      data.indexes[0].color.blue
    );

    const { date, time } = formatDateAndTime(data.dateTime, true);

    const quality = data.indexes.map((item: any) => ({
      value: item.aqiDisplay,
      category: item.category,
    }))[0];

    const code = data.indexes[0].code.toUpperCase();
    const population = data.indexes[0].dominantPollutant.toUpperCase();
    const populationDescription = data.pollutants.find(
      (item) => item.code === population.toLowerCase()
    ).fullName;

    return (
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-2" style={{ color: color }}>
              {quality.category}
            </h2>
            <p
              className="text-7xl font-bold inline-flex gap-2 items-end relative"
              style={{ color: color }}
            >
              {quality.value}
              <Wind className="absolute right-3 top-0" />
              <span className="text-white text-xl">{code}</span>
            </p>

            <div className="flex justify-between mt-4">
              <p>{date}</p>
              <p>{time}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent>
            <h2 className="text-2xl font-bold mb-2 text-orange-500">
              Main pollutant
            </h2>
            <p className="text-7xl font-bold inline-flex gap-2 items-end relative text-orange-500">
              {population}

              <Radiation className="absolute -right-8 top-0" />
            </p>
            <p className="mt-4">{populationDescription}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
};
