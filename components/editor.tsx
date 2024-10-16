"use client";

import useDebounce from "@/app/_hooks/useDebounce";
import { updateEntry } from "@/app/utils/api";
import { useEffect, useMemo, useRef, useState } from "react";

const Editor = ({
  entry,
}: {
  entry: { content: string; id: string; analyses: any[] };
}) => {
  const [text, setText] = useState(entry?.content);
  const debouncedText = useDebounce(text, 500);
  const [saveStatus, setSaveStatus] = useState<boolean>(false);
  const isInitialMount = useRef(true);
  const [analysis, setAnalysis] = useState(entry?.analyses[0]);

  const { mood, summary, color, subject, negative } = analysis;

  const analysisMapData = useMemo(() => {
    return [
      { name: "Subject", value: subject },
      { name: "Summary", value: summary },
      { name: "Mood", value: mood },
      { name: "Negative", value: JSON.stringify(negative) },
    ];
  }, [mood, summary, subject, negative]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedText === entry.content) {
      return;
    }

    const autoSave = async () => {
      try {
        setSaveStatus(true);
        const res = await updateEntry(entry.id, debouncedText);
        if (res) {
          console.log("~res::", res);
          setAnalysis(res?.analyses[0]);
        }
        console.log("res::", res);
      } catch (error) {
        console.error("Saving failed", error);
      } finally {
        setSaveStatus(false);
      }
    };
    if (debouncedText) {
      autoSave();
    }
  }, [debouncedText]);

  return (
    <>
      <div className="col-span-2">
        <textarea
          className="w-full h-full p-8 text-xl min-h-16"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <p>{saveStatus && "Saving"}</p>
      </div>
      <div className="border-l border-black/10">
        <div
          className="bg-blue-300 px-6 py-10"
          style={{ backgroundColor: color }}
        >
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisMapData.map((item) => (
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
      </div>
    </>
  );
};

export default Editor;
