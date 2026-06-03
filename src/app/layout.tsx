import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "TEKAD UNM — Tim Edukasi, Kreativitas, Aspirasi & Dedikasi",
    template: "%s | TEKAD UNM",
  },
  description:
    "Website resmi TEKAD — Unit Kegiatan Mahasiswa Universitas Negeri Makassar yang bergerak di bidang jurnalistik dan media kampus.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://tekad-unm.vercel.app"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
