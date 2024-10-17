import EntryCard from "@/components/entry-card";
import NewEntryCard from "@/components/new-entry-card";
import { getEntries } from "@/app/_actions/journal";
import Link from "next/link";
import Question from "@/components/question";

const JournalPage = async () => {
  const entries = await getEntries();
  return (
    <div className="p-10 bg-zinc-400/10 h-full">
      <h2 className="text-2xl">Journal</h2>
      <div className="my-8">
        <Question />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-3">
        <NewEntryCard />
        {entries?.map((entry) => (
          <Link key={entry.id} href={`/journal/${entry.id.toString()}`}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
