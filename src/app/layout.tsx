import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Image Generator",
  description: "Generate stunning images with AI using advanced Flux models",
  keywords: ["AI", "image generation", "art", "artificial intelligence"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen`}>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}