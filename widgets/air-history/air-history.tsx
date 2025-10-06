"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatDayOfWeek, formatTime } from "@/utils/formatter";
import { Wind } from "lucide-react";
import React, { useEffect } from "react";
import useSWRMutation from "swr/mutation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
async function fetchAirHistory(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify(arg),
  });

  if (!res.ok) throw new Error("Error al consultar la API de Google");
  return res.json();
}

export const AirHistory = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/air-quality/history",
    fetchAirHistory
  );

  const getData = async () => {
    trigger({
      location: {
        latitude: -14.049772786847141,
        longitude: -75.75019562271035,
      },
    });
  };

  useEffect(() => {
    getData();
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
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );

  if (data) {
    const history = data.data.hoursInfo;

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Historial de la calidad del aire</CardTitle>
          <CardDescription>
            Mostrando el historial de calidad del aire para las últimas horas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className=" pe-3">
            <ScrollBar orientation="vertical" />

            <div className="flex flex-col gap-2">
              {history.map((item, index) => (
                <Card key={index} className="shadow-none">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 flex items-center justify-center rounded-md bg-muted">
                          <Wind />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-4">
                            <p className="capitalize flex gap-2">
                              {/* {formatDayOfWeek(item.dateTime)} */}
                              <Badge> {formatTime(item.dateTime, true)}</Badge>
                            </p>
                            {/* <p>{formatTime(item.dateTime, true)}</p> */}
                          </div>
                          <p className="text-sm">{item.indexes[0].category}</p>
                        </div>
                      </div>
                      <div>
                        <div
                          className="h-11 w-11 flex items-center justify-center rounded-md bg-muted"
                          style={{
                            background: rgbToHex(
                              item.indexes[0].color.red,
                              item.indexes[0].color.green,
                              item.indexes[0].color.blue
                            ),
                          }}
                        >
                          <p className="text-background font-bold">
                            {item.indexes[0].aqiDisplay}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }
};
