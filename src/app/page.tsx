"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Pic from "./picture.jpg";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100 text-center space-y-6">
      <motion.h1
        className="text-2xl md:text-3xl font-bold text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        حاج صدم هاشمی
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Image
          src={Pic}
          alt="حاج صدم هاشمی"
          width={300}
          height={300}
          className="rounded-xl shadow-lg object-cover w-64 h-64 md:w-72 md:h-72"
        />
      </motion.div>

      <motion.figure
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="w-full max-w-xs md:max-w-sm"
      >
        <audio
          controls
          src="/public/voice.m4a
"
          className="w-full"
        />
      </motion.figure>

      <motion.blockquote
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed"
      >
        سعدیا مرد نکونام نمیرد هرگز <br />
        مرده آن است که نامش به نکویی نبرند
      </motion.blockquote>
    </div>
  );
}
