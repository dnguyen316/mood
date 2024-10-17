"use server";

import { db } from "@/app/db";
import { analysisTable } from "@/app/db/schema";
import { getUserByClerkID } from "@/app/utils/auth";
import { eq } from "drizzle-orm";

export const getData = async () => {
  const user = await getUserByClerkID();
  let analyses, avg;
  if (user) {
    analyses = await db.query.analysisTable.findMany({
      where: eq(analysisTable.userId, user?.id),
      // columns: {
      //   sentimentScore: true,
      // },
      orderBy: (analysisTable, { asc }) => [asc(analysisTable.createdAt)],
    });

    const sum = analyses.reduce(
      (acc, curVal) => acc + (curVal?.sentimentScore ?? 0),
      0
    );
    avg = Math.round(sum / analyses.length);
  }

  return { analyses, avg };
};
