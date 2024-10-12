import { db } from "@/app/db";
import { journalEntryTable } from "@/app/db/schema";
import { getUserByClerkID } from "@/app/utils/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    // const data = await request.json();
    const user = await getUserByClerkID();
    if (user?.id) {
      await db.insert(journalEntryTable).values({
        content: "this is new entry",
        userId: user?.id!,
      });

      const createdEntry = await db.query.journalEntryTable.findFirst({
        where: (entry, { eq }) => eq(entry.userId, user?.id!),
        orderBy: (entry, { desc }) => [desc(entry.id)],
      });

      revalidatePath("/journal");

      return NextResponse.json({ data: createdEntry });
    }
  } catch (error) {
    console.log(error);
  }
};
