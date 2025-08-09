// src/app/page.tsx
// "use client";

// import Link from "next/link";
// import Container from "@/components/Container";
// import Card from "@/components/Card";
// import { useTrips } from "@/lib/hooks/useTrips";

// export default function HomePage() {
//   const { trips, loading } = useTrips();

//   return (
//     <Container>
//       <h1 className="text-2xl2 font-bold mb-6">My Travel Planner</h1>

//       {loading ? (
//         <p>読み込み中…</p>
//       ) : trips.length === 0 ? (
//         <p>旅程がまだありません。</p>
//       ) : (
//         <div className="space-y-6">
//           {trips.map((t) => (
//             <Card key={t.id}>
//               <Link href={`/trips/${t.id}`} className="block p-4">
//                 <h2 className="text-lg font-semibold mb-2">{t.title}</h2>
//                 <p className="text-sm2 text-gray-600">
//                   {t.start_date} 〜 {t.end_date}
//                 </p>
//               </Link>
//             </Card>
//           ))}
//         </div>
//       )}
//     </Container>
//   );
// }

// // src/app/page.tsx
"use client";

import TripList from "@/components/TripList";
import { useTrips } from "@/lib/hooks/useTrips";

export default function HomePage() {
  const { trips, loading } = useTrips();

  return (
    <main className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">My Travel Planner</h1>
      {loading ? (
        <p className="p-4">読み込み中…</p>
      ) : (
        <TripList trips={trips} />
      )}
    </main>
  );
}
