import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mystic"
});

export const metadata: Metadata = {
  title: "Mystica - Nền tảng Huyền học trực tuyến",
  description: "Khám phá bản thân qua Tarot, Tử vi và AI Oracle",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={cn(
        "min-height-screen font-sans antialiased bg-mystic-dark text-foreground",
        inter.variable,
        cormorant.variable
      )}>
        <Navbar />
        <main className="pt-16 pb-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
