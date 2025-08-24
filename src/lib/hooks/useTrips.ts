// src/lib/hooks/useTrips.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Trip = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  budget: number;
  created_at: string;
  // user_id?: string; // 必要なら有効化
};

type UseTripsOptions = {
  userId?: string; // RLSでユーザー毎に絞る場合に使う
};

export function useTrips(options: UseTripsOptions = {}) {
  const { userId } = options;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrips = useCallback(
    async (aliveRef: { current: boolean }) => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("trips")
          .select("*")
          .order("created_at", { ascending: false });

        if (userId) {
          query = query.eq("user_id", userId);
        }

        const { data, error } = await query;

        if (!aliveRef.current) return;

        if (error) {
          console.error("Supabase trips select error", {
            message: error.message,
            details: (error as any).details,
            hint: (error as any).hint,
            code: (error as any).code,
          });

          // より詳細を state に渡す
          const msg = [
            error.message,
            (error as any).details,
            (error as any).hint,
            (error as any).code,
          ]
            .filter(Boolean)
            .join(" | ");

          setError(new Error(msg));
          setTrips([]);
          return;
        }

        console.log("Supabase trips select success", data);
        setTrips(data ?? []);
      } catch (e) {
        if (!aliveRef.current) return;
        console.error("Unexpected failure loading trips", e);
        setError(e instanceof Error ? e : new Error(String(e)));
        setTrips([]);
      } finally {
        if (!aliveRef.current) return;
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    const alive = { current: true };
    fetchTrips(alive);
    return () => {
      alive.current = false;
    };
  }, [fetchTrips]);

  // 外から再取得したいとき用
  const refresh = useCallback(async () => {
    const alive = { current: true };
    await fetchTrips(alive);
  }, [fetchTrips]);

  return { trips, loading, error, refresh };
}
