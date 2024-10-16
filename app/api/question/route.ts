import { db } from "@/app/db";
import { journalEntryTable } from "@/app/db/schema";
import { qa } from "@/app/utils/ai";
import { getUserByClerkID } from "@/app/utils/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { question } = await request.json();
    const user = await getUserByClerkID();

    if (user) {
      const entries = await db.query.journalEntryTable.findMany({
        where: eq(journalEntryTable.userId, user?.id),
        columns: {
          id: true,
          content: true,
          createdAt: true,
        },
      });

      const answer = await qa(question, entries);
      return NextResponse.json({ data: answer });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: error });
  }
};
