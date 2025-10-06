"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { useMap } from "react-leaflet/hooks";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import { useGeolocation } from "@/hooks/useGeolocation";

// Fix para los íconos
let DefaultIcon = L.icon({
  iconUrl: typeof icon === "string" ? icon : icon.src,
  iconRetinaUrl: typeof iconRetina === "string" ? iconRetina : iconRetina.src,
  shadowUrl: typeof iconShadow === "string" ? iconShadow : iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function HeatMap() {
  const location = useGeolocation();

  const position: [number, number] = [-14.049772786847141, -75.75019562271035];
  const API_HEAT_MAP = `/api/air-quality/tiles/{z}/{x}/{y}`;

  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={false}
      className="h-98 w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* air quality layer */}
      <TileLayer
        attribution="Air Quality overlay (Google)"
        url={API_HEAT_MAP}
        opacity={0.6}
      />
      <Marker position={position}>
        <Popup>Estas aquí</Popup>
      </Marker>
    </MapContainer>
  );
}
