// src/components/TripList.tsx
"use client";

import Link from "next/link";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { useTrips } from "@/lib/hooks/useTrips";

export default function TripList() {
  const { trips, loading } = useTrips();

  if (loading) return <p>読み込み中…</p>;
  if (trips.length === 0) return <p>まだ旅程が登録されていません。</p>;

  return (
    <Container>
      {trips.map((t) => (
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
      ))}
    </Container>
  );
}
