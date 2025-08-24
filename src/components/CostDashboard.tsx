"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function CostDashboard({ tripId }: { tripId: string }) {
  const [data, setData] = useState<{
    total: number;
    moveTotal: number;
    stayTotal: number;
    pieData: { name: string; value: number }[];
    dailyData: { date: string; cost: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/costs/${tripId}`);
        if (!r.ok) throw new Error(`API ${r.status}`);
        const json = await r.json();
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "読み込みに失敗しました");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tripId]);

  if (loading)
    return (
      <Card>
        <p>集計中…</p>
      </Card>
    );
  if (err)
    return (
      <Card>
        <p style={{ color: "red" }}>エラー: {err}</p>
      </Card>
    );
  if (!data)
    return (
      <Card>
        <p>データなし</p>
      </Card>
    );

  const { total, moveTotal, stayTotal, pieData, dailyData } = data;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 12,
        }}
      >
        <Kpi title="総費用" value={total} />
        <Kpi title="移動費" value={moveTotal} />
        <Kpi title="宿泊費" value={stayTotal} />
      </div>

      {/* 円グラフ */}
      <Card>
        <h3 style={{ margin: 0, fontSize: 16 }}>カテゴリ別</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => `¥${Number(v).toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 棒グラフ */}
      <Card>
        <h3 style={{ margin: 0, fontSize: 16 }}>日別費用</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => `¥${Number(v).toLocaleString()}`} />
              <Tooltip
                formatter={(v: any) => `¥${Number(v).toLocaleString()}`}
              />
              <Bar dataKey="cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <div style={{ fontSize: 12, color: "#666" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>
        ¥{Number(value || 0).toLocaleString()}
      </div>
    </Card>
  );
}
