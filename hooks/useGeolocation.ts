"use client";
import { useState, useEffect } from "react";

interface GeolocationState {
  loaded: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  error?: {
    code: number;
    message: string;
  };
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    loaded: false,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation({
        loaded: true,
        error: {
          code: 0,
          message: "La Geolocation API no está soportada en este navegador",
        },
      });
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        loaded: true,
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setLocation({
        loaded: true,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    };

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
}
