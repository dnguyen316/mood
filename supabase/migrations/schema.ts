import { pgTable, uniqueIndex, foreignKey, uuid, timestamp, text, boolean, unique } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const analyses = pgTable("analyses", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	mood: text("mood"),
	subject: text("subject"),
	summary: text("summary"),
	color: text("color"),
	negative: boolean("negative"),
	entryId: uuid("entry_id").notNull(),
},
(table) => {
	return {
		entryIdUniqueIdx: uniqueIndex("entry_id_unique_idx").using("btree", table.entryId.asc().nullsLast()),
		analysesEntryIdJournalEntriesIdFk: foreignKey({
			columns: [table.entryId],
			foreignColumns: [journalEntries.id],
			name: "analyses_entry_id_journal_entries_id_fk"
		}).onDelete("cascade"),
	}
});

export const journalEntries = pgTable("journal_entries", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	userId: uuid("user_id").notNull(),
	content: text("content"),
	analyses: uuid("analyses"),
},
(table) => {
	return {
		userIdIdUniqueIdx: uniqueIndex("user_id_id_unique_idx").using("btree", table.userId.asc().nullsLast(), table.id.asc().nullsLast()),
		journalEntriesUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "journal_entries_user_id_users_id_fk"
		}).onDelete("cascade"),
	}
});

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	clerkId: text("clerk_id").notNull(),
	email: text("email").notNull(),
},
(table) => {
	return {
		usersClerkIdUnique: unique("users_clerk_id_unique").on(table.clerkId),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});