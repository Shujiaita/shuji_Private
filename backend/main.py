from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os, httpx

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError("SUPABASE_URL / SUPABASE_ANON_KEY を .env に設定してください")

app = FastAPI(title="Travel Planner Backend")

# CORS
origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

def sb_headers():
    return {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Accept": "application/json",
    }

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/costs/{trip_id}")
async def get_costs(trip_id: str):
    """trip_legs と accommodations をSupabase RESTから読み、費用を集計して返す"""
    async with httpx.AsyncClient(timeout=20) as client:
        params = {"trip_id": f"eq.{trip_id}", "select": "*"}
        legs_r  = await client.get(f"{SUPABASE_URL}/rest/v1/trip_legs", headers=sb_headers(), params=params)
        acms_r  = await client.get(f"{SUPABASE_URL}/rest/v1/accommodations", headers=sb_headers(), params=params)

    if legs_r.status_code >= 400 or acms_r.status_code >= 400:
        raise HTTPException(500, f"supabase error: {legs_r.text} | {acms_r.text}")

    legs = legs_r.json()
    acms = acms_r.json()

    move_total = sum(int(l.get("cost") or 0) for l in legs)
    stay_total = sum(int(a.get("cost") or 0) for a in acms)
    total = move_total + stay_total

    daily = {}
    for l in legs:
        d = l.get("departure")
        if d:
            key = d[:10]
            daily[key] = daily.get(key, 0) + int(l.get("cost") or 0)
    for a in acms:
        d = a.get("check_in")
        if d:
            key = d[:10]
            daily[key] = daily.get(key, 0) + int(a.get("cost") or 0)

    daily_data = [{"date": k, "cost": v} for k, v in sorted(daily.items())]

    return {
        "total": total,
        "moveTotal": move_total,
        "stayTotal": stay_total,
        "pieData": [
            {"name": "移動", "value": move_total},
            {"name": "宿泊", "value": stay_total},
        ],
        "dailyData": daily_data,
    }
