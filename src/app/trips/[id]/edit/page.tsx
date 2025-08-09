// src/app/trips/[id]/edit/page.tsx
"use client";

import { useParams } from "next/navigation";
import Container from "@/components/Container";
import TripEditForm from "@/components/TripEditForm";

export default function EditTripPage() {
  const { id } = useParams() as { id: string };

  return (
    <Container>
      <h1 style={{ marginBottom: 16, fontSize: 20 }}>旅程を編集</h1>
      <TripEditForm id={id} />
    </Container>
  );
}
