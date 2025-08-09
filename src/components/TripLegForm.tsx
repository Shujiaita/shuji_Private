// src/components/TripLegForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ensureCityCoords } from "@/lib/ensureCityCoords";
import Input from "./Input";
import Button from "./Button";
import styles from "./TripLegForm.module.css";

export default function TripLegForm({
  tripId,
  onSuccess,
}: {
  tripId: string;
  onSuccess: () => void;
}) {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [mode, setMode] = useState("");
  const [cost, setCost] = useState<number | "">("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fromCity || !toCity || !mode || cost === "") {
      setError("必須項目を入力してください");
      return;
    }

    setSubmitting(true);
    try {
      // 都市名から座標を取得
      const [fromGeo, toGeo] = await Promise.all([
        ensureCityCoords(fromCity),
        ensureCityCoords(toCity),
      ]);

      if (!fromGeo || !toGeo) {
        setError(
          "都市名を座標に変換できませんでした。表記を見直してください。"
        );
        return;
      }

      // 移動区間を登録
      const { error: insertError } = await supabase.from("trip_legs").insert({
        trip_id: tripId,
        from_city: fromCity.trim(),
        to_city: toCity.trim(),
        mode,
        cost: Number(cost),
        departure: departure || null,
        arrival: arrival || null,
        from_lat: fromGeo.lat,
        from_lng: fromGeo.lng,
        to_lat: toGeo.lat,
        to_lng: toGeo.lng,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      // フォームリセット
      onSuccess();
      setFromCity("");
      setToCity("");
      setMode("");
      setCost("");
      setDeparture("");
      setArrival("");
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "送信中にエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.heading}>移動区間を追加</h3>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.fields}>
        <Input
          className={styles.field}
          placeholder="出発地"
          value={fromCity}
          onChange={(e) => setFromCity(e.target.value)}
        />
        <Input
          className={styles.field}
          placeholder="目的地"
          value={toCity}
          onChange={(e) => setToCity(e.target.value)}
        />
        <Input
          className={styles.field}
          placeholder="交通手段"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        />
        <Input
          className={styles.field}
          type="number"
          placeholder="費用"
          value={cost}
          onChange={(e) =>
            setCost(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <Input
          className={styles.field}
          type="datetime-local"
          placeholder="出発日時"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />
        <Input
          className={styles.field}
          type="datetime-local"
          placeholder="到着日時"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "送信中..." : "追加"}
        </Button>
      </div>
    </form>
  );
}
