import type { RsvpEntry } from "@/types";

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function buildRsvpCsv(entries: RsvpEntry[]) {
  const header = "ID,Nama Brand,Jumlah Tamu,Nama-nama Tamu,Waktu Konfirmasi";
  const rows = entries.map((entry) => {
    const guestNames = entry.guestNames.join("; ");

    return [
      entry.id,
      escapeCsv(entry.brandName),
      entry.guestCount,
      escapeCsv(guestNames),
      entry.createdAt,
    ].join(",");
  });

  return [header, ...rows].join("\n");
}
