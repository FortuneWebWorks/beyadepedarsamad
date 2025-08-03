"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Pic from "./picture.jpg";

const videoIds = [
  "14bkWbO93H4ft-fKcfvj6oHDj--KbZlDW",
  "16nx3O3voipyC0iGKhAEqxJVNTmmClVFa",
  "1mYNM8YOoGaRumhw2ubsrGKlIGNEEB-MA",
  "1aauOcjXU02GcsBxdCf4jnmlEMdqiQKjv",
];

const imageIds = [
  "1bEMY-G9XdkuL6CrLtiFpgnHcrZpLo43Z",
  "10Ivr--92SBo0Hf8F4MGFttK1h3IBaKL7",
  "1Y8Lu4b29JPWhmwnvQpe1TY0BFe7pzF0-",
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100 text-center space-y-8">
      {/* Title */}
      <motion.h1
        className="text-2xl md:text-3xl font-bold text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        یادگاری حاج صمد هاشمی
      </motion.h1>

      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Image
          src={Pic}
          alt="حاج صمد هاشمی"
          width={300}
          height={300}
          className="rounded-xl shadow-lg object-cover w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72"
          priority={true}
        />
      </motion.div>

      {/* Audio Players */}
      {["/voice.m4a", "/voice2.m4a"].map((src, i) => (
        <motion.figure
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md"
        >
          <audio controls src={src} className="w-full" />
        </motion.figure>
      ))}

      {/* Quote */}
      <motion.blockquote
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="text-gray-700 text-lg sm:text-xl font-medium leading-relaxed px-4"
      >
        سعدیا مرد نکونام نمیرد هرگز <br />
        مرده آن است که نامش به نکویی نبرند
      </motion.blockquote>

      {/* Videos Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {videoIds.map((id, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.6 }}
            className="aspect-video w-full rounded-lg overflow-hidden shadow-md"
          >
            <iframe
              src={`https://drive.google.com/file/d/${id}/preview`}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
              title={`Google Drive Video ${index + 1}`}
            ></iframe>
          </motion.div>
        ))}
      </motion.div>

      {/* Pictures Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 w-full max-w-4xl justify-center px-2 sm:px-0"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {imageIds.map((id, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, scale: 0.85 },
              show: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.6 }}
            className="w-full aspect-square rounded-lg overflow-visible shadow-md transform transition-transform hover:scale-105"
          >
            <img
              src={`https://drive.google.com/thumbnail?id=${id}&sz=w320-h320`}
              alt={`Google Drive Image ${index + 1}`}
              className="object-contain w-full h-full rounded-lg bg-white"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
