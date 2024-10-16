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
  id: uuid("id").primaryKey().defaultRandom(),
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
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    content: text("content"),
  },
  (table) => {
    return {
      userIdIdUniqueIdx: uniqueIndex("user_id_id_unique_idx").on(
        table.userId,
        table.id
      ),
    };
  }
);

export const analysisTable = pgTable(
  "analyses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),

    mood: text("mood"),
    subject: text("subject"),
    summary: text("summary"),
    color: text("color"),
    negative: boolean("negative"),

    entryId: uuid("entry_id")
      .notNull()
      .references(() => journalEntryTable.id, {
        onDelete: "cascade",
      }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
  },
  (table) => {
    return {
      entryIdIdx: uniqueIndex("entry_id_unique_idx").on(table.entryId),
      userIdIdx: index("user_id_idx").on(table.userId),
    };
  }
);

// Define Relations
export const userRelations = relations(usersTable, ({ many, one }) => ({
  entries: many(journalEntryTable),
  analyses: many(analysisTable),
}));

export const journalEntryRelations = relations(
  journalEntryTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [journalEntryTable.userId],
      references: [usersTable.id],
    }),
    analyses: many(analysisTable),
  })
);

export const analysisRelations = relations(analysisTable, ({ one }) => ({
  entry: one(journalEntryTable, {
    fields: [analysisTable.entryId],
    references: [journalEntryTable.id],
  }),
  user: one(usersTable, {
    fields: [analysisTable.userId],
    references: [usersTable.id],
  }),
}));

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertJournalEntryTable = typeof journalEntryTable.$inferInsert;
export type SelectJournalEntryTable = typeof journalEntryTable.$inferSelect;
