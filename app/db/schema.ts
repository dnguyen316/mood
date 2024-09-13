import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
});

export const journalEntryTable = pgTable(
  "journal_entry_table",
  {
    id: serial("id").primaryKey(),
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
      userIdIdx: index("user_id_idx").on(table.userId),
    };
  }
);

export const journalEntryRelations = relations(
  journalEntryTable,
  ({ one }) => ({
    analysisTable: one(analysisTable),
  })
);

export const analysisTable = pgTable(
  "analysis_table",
  {
    id: serial("id").primaryKey(),
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

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertJournalEntryTable = typeof journalEntryTable.$inferInsert;
export type SelectJournalEntryTable = typeof journalEntryTable.$inferSelect;
