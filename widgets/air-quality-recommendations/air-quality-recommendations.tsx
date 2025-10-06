"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { formatDateAndTime } from "@/utils/formatter";
import React, { useEffect } from "react";
import useSWRMutation from "swr/mutation";
import { RecommendationsCarousel } from "./recommendations-carousel";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchAirQuality(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!res.ok) throw new Error("Error al consultar la API de Google");
  return res.json();
}

export const AirQualityRecommendations = () => {
  const location = useGeolocation();
  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/air-quality/current-conditions",
    fetchAirQuality
  );

  const handleCheckAirQuality = async () => {
    await trigger({
      location: {
        latitude: location.loaded ? location.coordinates?.lat : 19.4326,
        longitude: location.loaded ? location.coordinates?.lng : -99.1332,
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
      <Card className="h-full">
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  if (data) {
    const recommendations = Object.entries(data.healthRecommendations).map(
      ([key, value], index) => ({
        id: String(index + 1),
        type: key,
        recommendation: value,
      })
    );

    const { date, time } = formatDateAndTime(data.dateTime, true);

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>
            Follow these recommendations to stay safe and healthy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecommendationsCarousel recommendations={recommendations} />
        </CardContent>
      </Card>
    );
  }
};
