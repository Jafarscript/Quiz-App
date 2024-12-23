'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <motion.h1
        className="text-5xl font-bold text-white mb-6"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        Welcome to the Quiz App
      </motion.h1>

      <div className="flex space-x-4">
        <Link href="/questions">
          <motion.button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Quiz
          </motion.button>
        </Link>

        <Link href="/participants">
          <motion.button
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Manage Participants
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
