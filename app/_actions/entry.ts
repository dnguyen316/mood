"use server";

import { db } from "@/app/db";
import { getUserByClerkID } from "@/app/utils/auth";

export const getEntry = async (id: string) => {
  const user = await getUserByClerkID();
  if (!user) {
    throw new Error("User not found");
  }
  try {
    // Fetch the journal entry with related analysis
    const entry = await db.query.journalEntryTable.findFirst({
      where: (journalEntryTable, { eq, and }) =>
        and(
          eq(journalEntryTable.id, id),
          eq(journalEntryTable.userId, user.id)
        ),
      with: {
        analyses: true,
      },
    });

    return entry;
  } catch (error) {
    console.error("Error fetching entry:", error);
  }
};
