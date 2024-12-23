"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Questions = {
  id: string;
};

const QuestionsPage = () => {
  const [questionCount, setQuestionCount] = useState<Questions[]>([]);
  // const questionCount = 10; // Total number of questions

  // Fetch participants from the backend
  const getQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setQuestionCount(data);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <section className="bg-gray-100 p-4">
      <Link
        href="/"
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Home
      </Link>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Select a Question</h1>
        <div className="grid grid-cols-3 gap-4">
          {questionCount.map((question) => (
            <Link key={question.id} href={`/questions/${question.id}`}>
              <button className="bg-blue-500 text-white w-20 h-20 rounded-md flex items-center justify-center hover:bg-blue-600">
                Q{question.id}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuestionsPage;
