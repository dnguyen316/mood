import { db } from "@/app/db";
import { analysisTable, journalEntryTable } from "@/app/db/schema";
import { analyze } from "@/app/utils/ai";
import { getUserByClerkID } from "@/app/utils/auth";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const user = await getUserByClerkID();
    const { id } = params;
    const { content } = await request.json();
    if (!user) {
      throw new Error("User not found");
    }

    try {
      const updatedEntry = await db
        .update(journalEntryTable)
        .set({ content })
        .where(
          and(
            eq(journalEntryTable.id, id),
            eq(journalEntryTable.userId, user?.id)
          )
        )
        .returning();

      if (updatedEntry) {
        const analysis = await analyze(updatedEntry[0]?.content!);
        const updatedAnalysis = await db
          .update(analysisTable)
          .set({ ...analysis })
          .where(eq(analysisTable.entryId, updatedEntry[0].id))
          .returning();

        return NextResponse.json({
          status: 200,
          data: { ...updatedEntry[0], analyses: [...updatedAnalysis] },
        });
      }
    } catch (error) {
      return NextResponse.json({ status: 400, message: "Bad Request" });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
};
