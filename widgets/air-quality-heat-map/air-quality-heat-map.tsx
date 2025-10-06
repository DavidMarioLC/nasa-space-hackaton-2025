"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import dynamic from "next/dynamic";
const HeatMap = dynamic(() => import("./heat-map"), {
  ssr: false,
  loading: () => (
    <Card className="h-full">
      <CardContent>
        <Skeleton className="h-98 w-full" />
      </CardContent>
    </Card>
  ),
});
export const AirQualityHeatMap = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Air Quality Heat Map</CardTitle>
        <CardDescription>
          Visualize air quality in different geographic regions using an
          interactive heat map.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HeatMap />
      </CardContent>
    </Card>
  );
};
