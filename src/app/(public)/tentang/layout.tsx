import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Profil, visi, misi, dan struktur organisasi TEKAD — Tim Media Kreatif Administrasi Bisnis UNM.",
};

export default function TentangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
