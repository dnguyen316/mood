import { getEntry } from "@/app/_actions/entry";
import Analysis from "@/components/analysis";
import Editor from "@/components/editor";

const EntryPage = async ({ params }: { params: { id: string } }) => {
  const entry = await getEntry(params.id);

  return (
    <div className="h-full w-full grid grid-cols-3">
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
