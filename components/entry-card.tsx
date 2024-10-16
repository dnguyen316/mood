const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt).toDateString();

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">{date}</div>
      <div className="px-4 py-5 sm:p-6">
        {entry?.analyses[0]?.summary ?? "summary"}
      </div>
      <div className="px-4 py-4 sm:px-6">
        {entry?.analyses[0]?.mood ?? "mood"}
      </div>
    </div>
  );
};

export default EntryCard;
