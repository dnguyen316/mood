import { getData } from "@/app/_actions/history";
import HistoryChart from "@/components/history-chart";

const History = async () => {
  const { analyses, avg } = await getData();

  return (
    <div className="w-full h-full">
      <div>Avg. Sentiment {avg}</div>
      <div className="h-full w-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
};

export default History;
