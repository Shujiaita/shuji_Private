// src/lib/ensureCityCoords.ts
import { supabase } from "./supabaseClient";

export async function ensureCityCoords(name: string) {
  // 1. city 大文字小文字無視で既存チェック
  const { data: byCity } = await supabase
    .from("city_coords")
    .select("city, lat, lng, aliases")
    .ilike("city", name)
    .maybeSingle();

  if (byCity) return { lat: byCity.lat, lng: byCity.lng };

  // 2. aliases に含まれるかチェック
  const { data: byAlias } = await supabase
    .from("city_coords")
    .select("city, lat, lng, aliases")
    .contains("aliases", [name])
    .maybeSingle();

  if (byAlias) return { lat: byAlias.lat, lng: byAlias.lng };

  // 3. 無ければジオコーディング (例: Nominatim)
  const geo = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      name
    )}`
  ).then((r) => r.json());

  if (!geo?.[0]) throw new Error(`座標が見つかりません: ${name}`);

  const lat = parseFloat(geo[0].lat);
  const lng = parseFloat(geo[0].lon);

  // 4. Supabase に保存（city_lc を衝突キーに）
  await supabase.from("city_coords").upsert(
    {
      city: name,
      country: null,
      lat,
      lng,
      aliases: [],
    },
    { onConflict: "city_lc" }
  );

  return { lat, lng };
}
