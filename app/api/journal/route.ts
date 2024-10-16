import { db } from "@/app/db";
import { analysisTable, journalEntryTable } from "@/app/db/schema";
import { analyze } from "@/app/utils/ai";
import { getUserByClerkID } from "@/app/utils/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    // const data = await request.json();
    const user = await getUserByClerkID();
    if (user?.id) {
      const entry = await db
        .insert(journalEntryTable)
        .values({
          content: "Write about your day!",
          userId: user?.id!,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()
        .then((data) => data[0]);

      if (entry.content) {
        const analysis = await analyze(entry?.content);
        if (analysis) {
          await db.insert(analysisTable).values({
            entryId: entry.id,
            userId: user?.id,
            ...analysis,
          });
        }
        console.log("entry::", entry);
        revalidatePath("/journal");
        return NextResponse.json({ data: entry });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
