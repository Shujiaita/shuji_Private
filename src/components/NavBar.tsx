// src/components/NavBar.tsx
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full bg-gray-100 p-4 shadow">
      <div className="max-w-4xl mx-auto flex items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          Travel Planner
        </Link>
        <div className="ml-auto space-x-4">
          <Link href="/trips/create" className="text-primary hover:underline">
            新規作成
          </Link>
        </div>
      </div>
    </nav>
  );
}
