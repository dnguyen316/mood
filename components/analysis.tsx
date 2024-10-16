"use client";

export interface IAnalysisProps {
  analysisData: {
    name: string;
    value: string;
  }[];
  // analysisData: {
  //   mood: string;
  //   summary: string;
  //   color: string;
  //   subject: string;
  //   negative: string;
  // }[];
  statusColor: string;
}

const Analysis = (props: IAnalysisProps) => {
  const { analysisData, statusColor } = props;
  // const { mood, summary, color, subject, negative } = analysisData[0];

  // const analysisMapData = [
  //   { name: "Subject", value: subject },
  //   { name: "Summary", value: summary },
  //   { name: "Mood", value: mood },
  //   { name: "Negative", value: negative },
  // ];

  return (
    <>
      <div
        className="bg-blue-300 px-6 py-10"
        style={{ backgroundColor: statusColor }}
      >
        <h2 className="text-2xl">Analysis</h2>
      </div>
      <div>
        <ul>
          {analysisData.map((item) => (
            <li
              key={item.name}
              className="flex py-4 px-2 items-center justify-between border-black/10 border-t border-b"
            >
              <span className="text-lg font-semibold">{item.name}</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Analysis;
