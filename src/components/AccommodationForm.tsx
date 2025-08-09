//src/components/AccommodationForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Input from "./Input";
import Button from "./Button";
import styles from "./AccommodationForm.module.css";

export default function AccommodationForm({
  tripId,
  onSuccess,
}: {
  tripId: string;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [cost, setCost] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !city || !checkIn || !checkOut || cost === "") {
      setError("必須項目を入力してください");
      return;
    }
    const { error: insertError } = await supabase
      .from("accommodations")
      .insert({
        trip_id: tripId,
        name,
        city,
        check_in: checkIn,
        check_out: checkOut,
        cost: Number(cost),
      });
    if (insertError) {
      setError(insertError.message);
    } else {
      onSuccess();
      setName("");
      setCity("");
      setCheckIn("");
      setCheckOut("");
      setCost("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.heading}>宿泊情報を追加</h3>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.fields}>
        <Input
          className={styles.field}
          placeholder="施設名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          className={styles.field}
          placeholder="都市"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Input
          className={styles.field}
          type="date"
          placeholder="チェックイン"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
        <Input
          className={styles.field}
          type="date"
          placeholder="チェックアウト"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
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
      </div>
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="primary">
          追加
        </Button>
      </div>
    </form>
  );
}
