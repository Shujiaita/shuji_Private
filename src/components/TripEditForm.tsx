// src/components/TripEditForm.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Input from "./Input";
import Button from "./Button";
import Card from "./Card";

export default function TripEditForm({ id }: { id: string }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 初期データ読み込み
  useEffect(() => {
    supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (data) {
          setTitle(data.title);
          setStartDate(data.start_date);
          setEndDate(data.end_date);
          setBudget(data.budget);
        }
        setLoading(false);
      });
  }, [id]);

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

    const { error: updateError } = await supabase
      .from("trips")
      .update({
        title,
        start_date: startDate,
        end_date: endDate,
        budget: Number(budget),
      })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
    }
  };

  if (loading) return <p style={{ padding: 16 }}>読み込み中…</p>;

  return (
    <Card>
      {error && <p style={{ color: "red", marginBottom: 8 }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
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
          更新する
        </Button>
      </form>
    </Card>
  );
}
