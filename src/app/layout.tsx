// // src/app/layout.tsx
// import "./globals.css";
// import NavBar from "@/components/NavBar";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="ja">
//       <body>
//         <NavBar />
//         <main className="max-w-4xl mx-auto p-4">{children}</main>
//       </body>
//     </html>
//   );
// }
// src/app/layout.tsx
// src/app/layout.tsx
// src/app/layout.tsx
import "./globals.css";
import NavBar from "@/components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {/* ここでナビバーを表示 */}
        <NavBar />
        {/* ここからページごとのコンテンツ */}
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
