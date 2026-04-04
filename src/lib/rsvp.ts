import { desc, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/index";
import { rsvpEntries } from "@/db/schema";
import type { RsvpEntry, RsvpStats, RsvpSubmission } from "@/types";

export const rsvpSubmissionSchema = z
  .object({
    brandName: z.string().trim().min(2).max(255),
    guestCount: z.number().int().min(1).max(100),
    guestNames: z.array(z.string().trim().min(1)).min(1),
  })
  .superRefine((value, context) => {
    if (value.guestNames.length !== value.guestCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Jumlah nama tamu (${value.guestNames.length}) tidak sesuai dengan jumlah tamu yang diisi (${value.guestCount})`,
        path: ["guestNames"],
      });
    }
  });

export function normalizeGuestNames(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function serializeEntry(entry: typeof rsvpEntries.$inferSelect): RsvpEntry {
  return {
    id: entry.id,
    brandName: entry.brandName,
    guestCount: entry.guestCount,
    guestNames: normalizeGuestNames(entry.guestNames),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export function validateRsvpSubmission(input: unknown) {
  return rsvpSubmissionSchema.safeParse(input);
}

export async function createRsvpEntry(input: RsvpSubmission) {
  await db.insert(rsvpEntries).values({
    brandName: input.brandName,
    guestCount: input.guestCount,
    guestNames: input.guestNames,
  });

  return {
    brandName: input.brandName,
    guestCount: input.guestCount,
  };
}

export async function getAllRsvpEntries() {
  const entries = await db.select().from(rsvpEntries).orderBy(desc(rsvpEntries.createdAt));
  return entries.map(serializeEntry);
}

export async function getRsvpStats(): Promise<RsvpStats> {
  const stats = await db
    .select({
      totalBrands: sql<number>`COUNT(DISTINCT ${rsvpEntries.brandName})`,
      totalGuests: sql<number>`COALESCE(SUM(${rsvpEntries.guestCount}), 0)`,
      totalResponses: sql<number>`COUNT(*)`,
    })
    .from(rsvpEntries);

  return {
    totalBrands: Number(stats[0]?.totalBrands) || 0,
    totalGuests: Number(stats[0]?.totalGuests) || 0,
    totalResponses: Number(stats[0]?.totalResponses) || 0,
  };
}
