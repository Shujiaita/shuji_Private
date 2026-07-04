// src/components/TripList.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Card from "@/components/Card";
import Container from "@/components/Container";
import type { Trip } from "@/lib/hooks/types";

type TripListProps = {
  trips: Trip[];
  loading?: boolean;
};

export default function TripList({ trips, loading = false }: TripListProps) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created_at" | "title">("created_at");

  const filteredTrips = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const baseTrips = normalizedQuery
      ? trips.filter((trip) => {
          const haystack =
            `${trip.title} ${trip.start_date} ${trip.end_date}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        })
      : trips;

    return [...baseTrips].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [query, sortBy, trips]);

  if (loading) return <p>読み込み中…</p>;
  if (trips.length === 0) return <p>まだ旅程が登録されていません。</p>;

  return (
    <Container>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="旅程を検索"
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
            {filteredTrips.length}件表示
          </p>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "created_at" | "title")
            }
            style={{
              padding: "6px 8px",
              border: "1px solid #ddd",
              borderRadius: 6,
            }}
          >
            <option value="created_at">新しい順</option>
            <option value="title">タイトル順</option>
          </select>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <p>条件に一致する旅程がありません。</p>
      ) : (
        filteredTrips.map((t) => (
          <Card key={t.id}>
            <Link
              href={`/trips/${t.id}`}
              className="block"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h2 style={{ margin: 0, fontSize: 18 }}>{t.title}</h2>
              <p style={{ margin: "8px 0" }}>
                {t.start_date} 〜 {t.end_date}
              </p>
            </Link>
          </Card>
        ))
      )}
    </Container>
  );
}
