// src/components/MapClient.tsx
"use client";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useMemo } from "react";

export type LatLng = [number, number];

type Props = { route?: LatLng[]; pins?: LatLng[]; coordinates?: LatLng[] };

function FitToBounds({ all }: { all: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (all.length === 0) return;
    if (all.length === 1) {
      map.setView(all[0], 8, { animate: false });
    } else {
      // @ts-ignore: leaflet の global L を使わず bounds を逐次計算
      const bounds = all.reduce(
        (acc: any, [lat, lng]: LatLng) => acc.extend([lat, lng]),
        // 初期値
        (window as any).L?.latLngBounds
          ? (window as any).L.latLngBounds([all[0], all[0]])
          : { extend: () => ({}) }
      );
      // L が無い環境でもコケないようにガード
      try {
        // @ts-ignore
        map.fitBounds(bounds, { padding: [40, 40], animate: false });
      } catch {
        /* noop */
      }
    }
  }, [map, all]);
  return null;
}

export default function MapClient(props: Props) {
  // coordinates だけ渡された場合も route として扱う
  const route: LatLng[] = useMemo(
    () =>
      props.route && props.route.length ? props.route : props.coordinates ?? [],
    [props.route, props.coordinates]
  );
  const pins: LatLng[] = useMemo(() => props.pins ?? [], [props.pins]);

  // 無効値を除外
  const cleanRoute = useMemo(
    () =>
      route.filter(
        ([lat, lng]) =>
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          Math.abs(lat) + Math.abs(lng) > 0
      ),
    [route]
  );
  const cleanPins = useMemo(
    () =>
      pins.filter(
        ([lat, lng]) =>
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          Math.abs(lat) + Math.abs(lng) > 0
      ),
    [pins]
  );

  const anyPoints = cleanRoute.length > 0 || cleanPins.length > 0;
  const center = (cleanRoute[0] ??
    cleanPins[0] ?? [35.681236, 139.767125]) as LatLng;

  if (!anyPoints) return <p>地図データがありません</p>;

  const all = [...cleanRoute, ...cleanPins];

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ width: "100%", height: 300, borderRadius: 8 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      <FitToBounds all={all} />
      {cleanRoute.length > 1 && <Polyline positions={cleanRoute} weight={4} />}
      {cleanRoute.map((pos, i) => (
        <Marker key={`r-${i}`} position={pos}>
          <Popup>Leg {i + 1}</Popup>
        </Marker>
      ))}
      {cleanPins.map((pos, i) => (
        <Marker key={`p-${i}`} position={pos}>
          <Popup>宿泊 {i + 1}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
