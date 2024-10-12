import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
});

export const journalEntryTable = pgTable(
  "journal_entries",
  {
    id: uuid("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),

    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    content: text("content"),
  },
  (table) => {
    return {
      userIdIdx: index("user_id_idx").on(table.userId, table.id),
    };
  }
);

export const analysisTable = pgTable(
  "analyses",
  {
    id: uuid("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),

    mood: text("mood"),
    summary: text("summary"),
    color: text("color"),
    negative: boolean("negative"),

    entryId: integer("entry_id")
      .notNull()
      .references(() => journalEntryTable.id, {
        onDelete: "cascade",
      }),
  },
  (table) => {
    return {
      entryIdIdx: uniqueIndex("entry_id_unique_idx").on(table.entryId),
    };
  }
);

export const journalEntryRelations = relations(
  journalEntryTable,
  ({ one }) => ({
    analysis: one(analysisTable, {
      fields: [journalEntryTable.id],
      references: [analysisTable.entryId],
    }),
  })
);

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertJournalEntryTable = typeof journalEntryTable.$inferInsert;
export type SelectJournalEntryTable = typeof journalEntryTable.$inferSelect;
