import { usersTable } from "@/app/db/schema";
import { db } from "./db";

export default async function Home() {
  const allUsers = await db.select().from(usersTable);

  console.log(allUsers);

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl">the best Journal app, period.</h1>
        <p className="text-2xl text-white/60">
          This is the best app for tracking your mood through out your life.
        </p>
        <div>
          <button className="bg-blue-600 p-4 rounded-lg text-xl">
            get started
          </button>
        </div>
      </div>
    </div>
  );
}
