import { relations } from "drizzle-orm/relations";
import { journalEntries, analyses, users } from "./schema";

export const analysesRelations = relations(analyses, ({one}) => ({
	journalEntry: one(journalEntries, {
		fields: [analyses.entryId],
		references: [journalEntries.id]
	}),
}));

export const journalEntriesRelations = relations(journalEntries, ({one, many}) => ({
	analyses: many(analyses),
	user: one(users, {
		fields: [journalEntries.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	journalEntries: many(journalEntries),
}));