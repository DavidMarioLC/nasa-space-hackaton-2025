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
import {
  Building,
  Car,
  Eye,
  Factory,
  Heart,
  Radiation,
  Wind,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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

export const AirPollutant = () => {
  const location = useGeolocation();
  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/air-quality/current-conditions",
    fetchAirQuality
  );

  const [details, setDetails] = useState(false);
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
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-10/12" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/2" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
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

    const pollutants = data.pollutants;

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Pollutant Concentration</CardTitle>
          <CardDescription>
            Last update: {date} {time}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of air pollutants</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pollutants.map((pollutant, index) => (
                <TableRow key={index}>
                  <TableCell>{pollutant.fullName}</TableCell>
                  <TableCell>{pollutant.displayName}</TableCell>
                  <TableCell>{pollutant.concentration.value}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild className="cursor-pointer">
                        <Button>
                          <Eye />
                          View details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="z-[9999]">
                        <DialogHeader>
                          <DialogTitle>
                            {pollutant.fullName} {pollutant.displayName}
                          </DialogTitle>
                          <DialogDescription>
                            Details about this pollutant
                          </DialogDescription>
                        </DialogHeader>
                        <section>
                          <div className="py-10">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="rounded-md bg-blue-500 p-2 w-fit">
                                <Factory />
                              </div>
                              <h2 className="font-bold">Common sources</h2>
                            </div>
                            {pollutant.additionalInfo.sources}
                          </div>
                          <Separator />
                          <div className="py-10">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="rounded-md bg-destructive p-2 w-fit">
                                <Heart />
                              </div>
                              <h2 className="font-bold">Health effects</h2>
                            </div>
                            {pollutant.additionalInfo.effects}
                          </div>
                        </section>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
};
