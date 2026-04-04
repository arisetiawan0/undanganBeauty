import type { Metadata } from "next";
import AdminPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Invitation Admin - Dashboard Daftar Tamu",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPageClient />;
}
