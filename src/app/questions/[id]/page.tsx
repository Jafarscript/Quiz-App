"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BackButton from "@/app/components/BackButton";

type Question = {
  id: number;
  question_text: string;
  correct_answer: string;
  options: string[];
};

const QuestionPage = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [timer, setTimer] = useState(30);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  // Fetch the question
  const getQuestion = async () => {
    try {
      const response = await fetch(`/api/questions/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Question = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    getQuestion();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      alert("Time's up!");
      router.push("/questions");
    }
  }, [timer, router]);

  // Play sound
  const playSound = (correct: boolean) => {
    const audio = new Audio(correct ? "/correct.mp3" : "/wrong.mp3");
    audio.play();
  };

  // Handle answer selection
  const handleAnswerSelection = (option: string) => {
    if (!isConfirmed) setSelectedOption(option);
  };

  // Confirm answer
  const confirmAnswer = () => {
    if (selectedOption) {
      const correct = selectedOption === question?.correct_answer;
      setIsCorrect(correct);
      playSound(correct);
      setIsConfirmed(true);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (isCorrect) router.push(`/surprise`);
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 p-4">
      <BackButton />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">{question.question_text}</h1>
        <p className="text-xl text-gray-700 mb-6">Time Remaining: {timer}s</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {question.options.map((option, index) => {
            let bgColor = "bg-blue-500"; // Default color
            if (isConfirmed) {
              if (option === question.correct_answer) bgColor = "bg-green-500"; // Correct answer
              else if (option === selectedOption) bgColor = "bg-red-500"; // Incorrect answer
            } else if (option === selectedOption) {
              bgColor = "bg-gray-500"; // Selected but not confirmed
            }

            return (
              <button
                key={index}
                className={`px-4 py-2 rounded-md text-white ${bgColor} hover:bg-blue-600`}
                onClick={() => handleAnswerSelection(option)}
                disabled={isConfirmed}
              >
                {option}
              </button>
            );
          })}
        </div>
        {selectedOption && !isConfirmed && (
          <button
            className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={confirmAnswer}
          >
            Confirm Answer
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">
              {isCorrect ? "Correct Answer!" : "Wrong Answer!"}
            </h2>
            {isCorrect && (
              <p className="mb-4">
                Congratulations! Click the link below to proceed to your surprise.
              </p>
            )}
            {!isCorrect && (
              <p className="mb-4">Better luck next time! Try again with another question.</p>
            )}
            <div className="flex justify-center items-center gap-4">
            {isCorrect && (
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Go to Surprise
              </button>
            )}
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuestionPage;
