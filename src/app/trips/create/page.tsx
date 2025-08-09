// src/app/trips/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import Card from "@/components/Card";
import TripForm from "@/components/TripForm";

export default function CreateTripPage() {
  const router = useRouter();

  return (
    <Container>
      <Card>
        <h1 style={{ marginBottom: 16, fontSize: 20 }}>新しい旅程を作成</h1>
        <TripForm onSuccess={(id: string) => router.push(`/trips/${id}`)} />
      </Card>
    </Container>
  );
}
