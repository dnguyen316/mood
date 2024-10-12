import { auth } from "@clerk/nextjs/server";
import { db } from "../db";
import { mockCurrentUser } from "@/__mocks/user";
import { SelectUser, SelectJournalEntryTable } from "../db/schema";

export type UserWithJournalTable = SelectUser & {
  journalEntries?: SelectJournalEntryTable[];
};

export const getUserByClerkID = async () => {
  const { userId: userIdClerk } = await auth();

  const userId =
    process.env.NODE_ENV === "development"
      ? mockCurrentUser()?.id
      : userIdClerk;

  if (!userId) return null;

  try {
    // Query to find the user by Clerk ID
    let user: UserWithJournalTable | undefined =
      await db.query.usersTable.findFirst({
        where: (usersTable, { eq }) => eq(usersTable.clerkId, userId),
      });

    if (user?.id) {
      // If a user is found, get related journal entries
      const journalEntries = await db.query.journalEntryTable.findMany({
        where: (journalEntryTable, { eq }) =>
          eq(journalEntryTable.userId, user?.id!),
      });

      // Attach journal entries to the user object if found
      user = { ...user, journalEntries };

      return user;
    }
  } catch (dbError) {
    throw new Error(
      `Error querying usersTable: ${(dbError as { message: string }).message}`
    );
  }
};
