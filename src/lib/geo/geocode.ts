import { supabase } from "@/lib/supabaseClient";
import { geocodeCityNominatim } from "./geocode";

/** 都市名を city_coords で解決。なければ Nominatim で作って upsert し、座標を返す */
export async function ensureCityCoords(
  city: string
): Promise<{ lat: number; lng: number } | null> {
  const name = city.trim();
  if (!name) return null;

  // 既存ヒット（city or aliases）
  const { data: found, error: selErr } = await supabase
    .from("city_coords")
    .select("city, lat, lng, aliases")
    .or(`city.ilike.${name},aliases.cs.{${name}}`)
    .limit(1);

  if (selErr) {
    console.error("select city_coords failed", selErr);
  }
  if (found && found.length > 0) {
    return { lat: found[0].lat, lng: found[0].lng };
  }

  // 無ければジオコーディング
  const geo = await geocodeCityNominatim(name);
  if (!geo) return null;

  // DB に upsert（lower(city) unique 前提）
  const { error: upErr } = await supabase.from("city_coords").upsert(
    {
      city: name,
      country: null,
      lat: geo.lat,
      lng: geo.lng,
      aliases: [],
    },
    { onConflict: "city" }
  );
  if (upErr) {
    console.error("upsert city_coords failed", upErr);
  }
  return geo;
}
