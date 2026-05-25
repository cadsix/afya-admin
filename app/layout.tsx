import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["300","400","500","600"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", weight: ["400","500"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["700"] });

export const metadata: Metadata = {
  title: "Afya — Admin Dashboard",
  description: "Ho Municipal Health Directorate Programme Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable} ${cormorant.variable} h-full`}>
      <body className="h-full flex flex-col overflow-hidden" style={{ fontFamily: "var(--font-outfit), sans-serif", background: "var(--off)", color: "var(--ink)" }}>
        {children}
      </body>
    </html>
  );
}
