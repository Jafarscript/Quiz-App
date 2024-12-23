"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Surprise = {
  id: number;
  surprise_text: string;
  surprise_value: number;
};

const SurprisePage = () => {
  const router = useRouter();
  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchSurprise = async () => {
    try {
      const response = await fetch('/api/surprise');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSurprise(data[0]);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  useEffect(() => {
    fetchSurprise();
  }, []);

  // Handle opening the surprise
  const openSurprise = () => {
    setIsOpen(true);
  };

  const goBack = () => {
    router.push("/questions");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <motion.h1
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Surprise Page
      </motion.h1>

      <motion.p
        className="text-xl text-gray-700 mb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        You&apos;ve answered correctly! Here&apos;s your surprise.
      </motion.p>

      <motion.button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={openSurprise}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        Open Surprise
      </motion.button>

      {isOpen && surprise && (
        <motion.div
          className="mt-4 p-4 bg-white rounded-md shadow-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="text-lg font-bold mb-2">{surprise.surprise_text}</p>
          <p className="text-sm text-gray-500">Value: ${surprise.surprise_value}</p>
        </motion.div>
      )}

      {isOpen && !surprise && (
        <motion.div
          className="mt-4 p-4 bg-white rounded-md shadow-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="text-lg">No surprises available right now. Please try again later.</p>
        </motion.div>
      )}

      <motion.button
        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        onClick={goBack}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Back to Questions
      </motion.button>
    </div>
  );
};

export default SurprisePage;
