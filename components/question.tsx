"use client";

import { askQuestion } from "@/app/utils/api";
import { useState } from "react";

const Question = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const answer = await askQuestion(value);
      setResponse(answer);
      setValue("");
      setLoading(false);
    } catch (error) {
      console.error("mss::", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="border border-black/20 px-4 py-2 text-lg rounded-lg mr-4"
          onChange={handleOnChange}
          value={value}
          type="text"
          placeholder="Ask a question"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-lg"
        >
          Ask
        </button>
      </form>
      {loading && <div>...Loading</div>}
      {response && <div>{response}</div>}
    </div>
  );
};

export default Question;
