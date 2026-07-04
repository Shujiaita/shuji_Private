// src/lib/hooks/types.ts
export type Trip = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  budget: number;
  created_at: string;
};

export type TripLeg = {
  id: string;
  trip_id: string;
  from_city: string;
  to_city: string;
  mode: string;
  cost: number;
  departure: string | null;
  arrival: string | null;
};

export type Accommodation = {
  id: string;
  trip_id: string;
  name: string;
  city: string;
  check_in: string;
  check_out: string;
  cost: number;
};
