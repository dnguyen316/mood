"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "../db";
import { journalEntryTable, usersTable } from "../db/schema";
import { redirect } from "next/navigation";
import { mockCurrentUser } from "@/__mocks/user";

export const createNewUser = async () => {
  let isSuccess = false;
  try {
    const user =
      process.env.NODE_ENV === "development"
        ? mockCurrentUser()
        : await currentUser();
    let userId, userEmail;

    if (user) {
      userId = user.id;
      userEmail = user.emailAddresses[0]?.emailAddress;
    } else {
      throw new Error("User is not authenticated or user details are missing.");
    }

    let match;
    if (userId) {
      try {
        match = await db.query.usersTable.findFirst({
          where: (usersTable, { eq }) => eq(usersTable.clerkId, userId),
        });
      } catch (dbError) {
        throw new Error(
          `Error querying usersTable: ${
            (dbError as { message: string }).message
          }`
        );
      }
    } else {
      throw new Error("User ID is not available.");
    }

    if (!match && userId && userEmail) {
      try {
        await db.insert(usersTable).values({
          clerkId: userId,
          email: userEmail,
        });

        // Query the newly inserted user to get the user ID
        const newUser = await db.query.usersTable.findFirst({
          where: (usersTable, { eq }) => eq(usersTable.clerkId, userId),
        });

        console.log("New user created:", newUser);

        if (newUser) {
          // Insert new journal entry for the user
          const journalEntry = await db.insert(journalEntryTable).values({
            userId: newUser.id, // Use the new user's ID
            content: "This is your first journal entry!", // Example content
          });

          console.log("New journal entry created:", journalEntry);

          isSuccess = true;
        }
      } catch (dbInsertError) {
        throw new Error(
          `Error inserting new user into usersTable: ${
            (dbInsertError as { message: string }).message
          }`
        );
      }
    } else if (match) {
      console.log("User already exists:", match);
    } else {
      throw new Error("Unable to create user. Missing required information.");
    }
  } catch (error) {
    console.error(
      "An error occurred::",
      (error as { message: string }).message
    );
  } finally {
    if (isSuccess) redirect("/journal");
  }
};
