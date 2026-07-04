// src/components/TripDetail.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Container from "@/components/Container";
import Card from "@/components/Card";
import Button from "@/components/Button";
import TripLegForm from "@/components/TripLegForm";
import AccommodationForm from "@/components/AccommodationForm";
import { type Trip, type TripLeg, type Accommodation } from "@/lib/hooks/types";
import MapViewer from "@/components/MapViewer"; // ← route/pins を渡す版
import CostDashboard from "@/components/CostDashboard";

export default function TripDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [legs, setLegs] = useState<TripLeg[]>([]);
  const [acms, setAcms] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function fetchAll() {
      setLoading(true);
      setError(null);

      const [tRes, lRes, aRes] = await Promise.all([
        supabase.from("trips").select("*").eq("id", id).single(),
        supabase
          .from("trip_legs")
          .select("*")
          .eq("trip_id", id)
          .order("departure", { ascending: true }), // ルート順
        supabase
          .from("accommodations")
          .select("*")
          .eq("trip_id", id)
          .order("check_in", { ascending: true }),
      ]);

      if (!alive) return;

      if (tRes.error) {
        console.error("Trip load error:", tRes.error);
        setError(tRes.error.message);
        setTrip(null);
      } else {
        setTrip((tRes.data as Trip | null) ?? null);
      }

      if (lRes.error) console.error("Trip legs load error:", lRes.error);
      if (aRes.error) console.error("Accommodations load error:", aRes.error);

      setLegs(lRes.data || []);
      setAcms(aRes.data || []);
      setLoading(false);
    }

    fetchAll();
    return () => {
      alive = false;
    };
  }, [id]);

  // ---------- ルートとピンを分けて算出 ----------

  // legs から順序通りに [lat,lng] の配列を作成（重複/無効値を除外）
  const route = useMemo<[number, number][]>(() => {
    const out: [number, number][] = [];
    for (const leg of legs) {
      const legData = leg as TripLeg & {
        from_lat?: number;
        from_lng?: number;
        to_lat?: number;
        to_lng?: number;
      };
      const fromOk =
        Number.isFinite(legData.from_lat) && Number.isFinite(legData.from_lng);
      const toOk =
        Number.isFinite(legData.to_lat) && Number.isFinite(legData.to_lng);

      if (fromOk) {
        const p: [number, number] = [
          legData.from_lat as number,
          legData.from_lng as number,
        ];
        if (
          !out.length ||
          out[out.length - 1][0] !== p[0] ||
          out[out.length - 1][1] !== p[1]
        ) {
          out.push(p);
        }
      }
      if (toOk) {
        const p: [number, number] = [
          legData.to_lat as number,
          legData.to_lng as number,
        ];
        if (
          !out.length ||
          out[out.length - 1][0] !== p[0] ||
          out[out.length - 1][1] !== p[1]
        ) {
          out.push(p);
        }
      }
    }
    return out.filter(
      (point): point is [number, number] =>
        Math.abs(point[0]) + Math.abs(point[1]) > 0,
    );
  }, [legs]);

  // 宿泊ピン用
  const pins = useMemo<[number, number][]>(() => {
    return acms
      .map((a) => a as Accommodation & { lat?: number; lng?: number })
      .filter((a) => Number.isFinite(a.lat) && Number.isFinite(a.lng))
      .map((a) => [a.lat as number, a.lng as number] as [number, number])
      .filter((point) => Math.abs(point[0]) + Math.abs(point[1]) > 0);
  }, [acms]);

  if (loading) {
    return (
      <Container>
        <p>読み込み中…</p>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <p style={{ color: "red" }}>エラー: {error}</p>
      </Container>
    );
  }
  if (!trip) {
    return (
      <Container>
        <p>旅程が見つかりません。</p>
      </Container>
    );
  }

  return (
    <Container>
      {/* 旅程の基本情報 */}
      <Card>
        <h1 style={{ margin: 0, fontSize: 24 }}>{trip.title}</h1>
        <p>
          <strong>期間：</strong>
          {trip.start_date} 〜 {trip.end_date}
        </p>
        <p>
          <strong>予算：</strong>¥{Number(trip.budget).toLocaleString()}
        </p>
        <p style={{ fontSize: 12, color: "#666" }}>
          作成日: {new Date(trip.created_at).toLocaleString()}
        </p>
      </Card>

      <Card>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>費用ダッシュボード</h2>
        <CostDashboard tripId={id} />
      </Card>

      {/* 地図表示（どちらかがあれば） */}
      {(route.length > 0 || pins.length > 0) && (
        <Card>
          <MapViewer route={route} pins={pins} />
        </Card>
      )}

      {/* 移動区間セクション */}
      <Card>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>移動区間</h2>
        {legs.length === 0 ? (
          <p>まだ登録されていません。</p>
        ) : (
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {legs.map((l) => (
              <li
                key={l.id}
                style={{ padding: 8, borderBottom: "1px solid #eee" }}
              >
                {l.from_city} → {l.to_city} ({l.mode}) ¥
                {Number(l.cost).toLocaleString()}
                <br />
                {l.departure && new Date(l.departure).toLocaleString()} 〜{" "}
                {l.arrival && new Date(l.arrival).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
        <TripLegForm
          tripId={id}
          onSuccess={() =>
            supabase
              .from("trip_legs")
              .select("*")
              .eq("trip_id", id)
              .order("departure", { ascending: true })
              .then(({ data }) => setLegs(data || []))
          }
        />
      </Card>

      {/* 宿泊情報セクション */}
      <Card>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>宿泊情報</h2>
        {acms.length === 0 ? (
          <p>まだ登録されていません。</p>
        ) : (
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {acms.map((a) => (
              <li
                key={a.id}
                style={{ padding: 8, borderBottom: "1px solid #eee" }}
              >
                {a.name}（{a.city}） ¥{Number(a.cost).toLocaleString()}
                <br />
                {a.check_in} 〜 {a.check_out}
              </li>
            ))}
          </ul>
        )}
        <AccommodationForm
          tripId={id}
          onSuccess={() =>
            supabase
              .from("accommodations")
              .select("*")
              .eq("trip_id", id)
              .order("check_in", { ascending: true })
              .then(({ data }) => setAcms(data || []))
          }
        />
      </Card>

      {/* 編集・削除ボタン */}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Button
          variant="outline"
          onClick={() => router.push(`/trips/${id}/edit`)}
        >
          編集
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            if (confirm("本当に削除しますか？")) {
              await supabase.from("trips").delete().eq("id", id);
              router.push("/");
            }
          }}
        >
          削除
        </Button>
      </div>
    </Container>
  );
}
