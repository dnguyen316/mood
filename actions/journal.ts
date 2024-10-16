"use server";

import { db } from "@/app/db";
import { getUserByClerkID } from "@/app/utils/auth";

export const getEntries = async () => {
  const user = await getUserByClerkID();
  let entries;
  if (user) {
    try {
      entries = await db.query.journalEntryTable.findMany({
        where: (journalEntryTable, { eq }) =>
          eq(journalEntryTable.userId, user?.id),
        orderBy: (journalEntryTable, { desc }) => [
          desc(journalEntryTable.createdAt),
        ],
        with: {
          analyses: true,
        },
      });
    } catch (dbError) {
      `Error querying journalEntryTable: ${
        (dbError as { message: string }).message
      }`;
    }
  }
  return entries;
};
