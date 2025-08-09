// src/components/MapViewer.tsx
"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

export type LatLng = [number, number];

type Props =
  | { route?: LatLng[]; pins?: LatLng[]; coordinates?: never }
  | { coordinates: LatLng[]; route?: never; pins?: never }
  | { route?: LatLng[]; pins?: LatLng[]; coordinates?: LatLng[] }; // 互換用

const LeafletMap = dynamic(() => import("./MapClient"), { ssr: false });

export default function MapViewer(props: Props) {
  return <LeafletMap {...props} />;
}
