// src/components/TripForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Input from "./Input";
import Button from "./Button";

export default function TripForm({
  onSuccess,
}: {
  onSuccess: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title || !startDate || !endDate || budget === "") {
      setError("すべての項目を入力してください");
      return;
    }
    if (startDate > endDate) {
      setError("開始日は終了日より前に設定してください");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("trips")
      .insert({
        title,
        start_date: startDate,
        end_date: endDate,
        budget: Number(budget),
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      onSuccess(data.id);
      setTitle("");
      setStartDate("");
      setEndDate("");
      setBudget("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red", marginBottom: 8 }}>{error}</p>}
      <Input
        placeholder="旅程タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="date"
        placeholder="開始日"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <Input
        type="date"
        placeholder="終了日"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <Input
        type="number"
        placeholder="予算（円）"
        value={budget}
        onChange={(e) =>
          setBudget(e.target.value === "" ? "" : Number(e.target.value))
        }
      />
      <Button type="submit" variant="primary">
        旅程を作成
      </Button>
    </form>
  );
}
