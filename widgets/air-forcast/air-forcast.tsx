"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useSWRMutation from "swr/mutation";
import { formatHour } from "@/utils/formatter";

const dataMock = [
  { aqi: 10, hour: "1 AM" },
  { aqi: 20, hour: "2 AM" },
  { aqi: 30, hour: "3 AM" },
  { aqi: 40, hour: "4 AM" },
  { aqi: 20, hour: "5 AM" },
  { aqi: 20, hour: "6 AM" },
];

const chartDatConfig = {
  aqi: {
    label: "AQI",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

/**
 * Genera el objeto 'period' para obtener un pronóstico de 24 horas
 * que comienza en la próxima hora completa + 1 hora.
 * * @param {number} [durationHours=24] - La duración del pronóstico en horas (máx. 96).
 * @returns {object} El objeto 'period' con startTime y endTime en formato RFC3339 (UTC).
 */
function generarPeriodoDePronosticoAdelantado(durationHours = 4) {
  // 1. OBTENER EL PUNTO DE PARTIDA (Hora actual + 1 hora)

  const now = new Date();

  // Sumamos una hora al momento actual para el "adelanto"
  // Esto asegura que el pronóstico comience en el futuro.
  now.setHours(now.getHours() + 1);

  // 2. CALCULAR EL startTime (Redondear a la próxima hora exacta)

  // Si la hora es 05:53 AM, el próximo límite de hora es 06:00 AM.
  // Redondeamos hacia arriba a la hora completa más cercana.
  const startTimeMs =
    Math.ceil(now.getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000);
  const startDate = new Date(startTimeMs);

  // Convertir a formato RFC3339 (ISO 8601) con Z (UTC)
  const startTime = startDate.toISOString();

  // 3. CALCULAR EL endTime (startTime + 24 horas)

  const durationMs = durationHours * 60 * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationMs);

  // Convertir a formato RFC3339 (ISO 8601) con Z (UTC)
  const endTime = endDate.toISOString();

  // 4. DEVOLVER EL OBJETO LISTO
  return {
    startTime: startTime,
    endTime: endTime,
  };
}

async function fetchAirForecast(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!res.ok) throw new Error("Error al consultar la API de Google");
  return res.json();
}

export const AirForecast = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/air-quality/forecast",
    fetchAirForecast
  );

  const handleCheckAirQuality = async () => {
    const { startTime, endTime } = generarPeriodoDePronosticoAdelantado();
    await trigger({
      location: {
        latitude: -14.049772786847141,
        longitude: -75.75019562271035,
      },
      period: {
        startTime: startTime,
        endTime: endTime,
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
        <CardContent>
          <Skeleton className="h-92 w-full" />
        </CardContent>
      </Card>
    );

  if (data) {
    const chartData = data.hourlyForecasts.map((forecast: any) => ({
      hour: formatHour(forecast.dateTime, true),
      aqi: forecast.indexes[0].aqi,
    }));

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Air Quality Forecast</CardTitle>
          <CardDescription>
            Air quality forecast for the next 4 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartDatConfig}>
            <AreaChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={18}
              />
              <YAxis
                dataKey="aqi"
                tickLine={false}
                axisLine={false}
                tickMargin={20}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="aqi"
                type="natural"
                fill="url(#fillAqi)"
                fillOpacity={0.4}
                stroke="var(--chart-1)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
};
