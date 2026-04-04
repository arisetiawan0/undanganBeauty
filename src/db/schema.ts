import { mysqlTable, int, varchar, json, timestamp, serial } from 'drizzle-orm/mysql-core';

// Tabel untuk menyimpan konfirmasi kehadiran (RSVP)
export const rsvpEntries = mysqlTable('rsvp_entries', {
  id: serial('id').primaryKey(),
  brandName: varchar('brand_name', { length: 255 }).notNull(),
  guestCount: int('guest_count').notNull(),
  guestNames: json('guest_names').notNull().$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Type inference untuk TypeScript
export type RsvpEntry = typeof rsvpEntries.$inferSelect;
export type NewRsvpEntry = typeof rsvpEntries.$inferInsert;
